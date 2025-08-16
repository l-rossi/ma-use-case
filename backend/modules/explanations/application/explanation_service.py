from typing import List

from modules.atoms.application.atom_service import AtomService
from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.chat.domain.context_message_type import ContextMessageType
from modules.common.util import format_prolog_knowledge_base
from modules.explanations.application.dto.example_generation_dto import ExamplesDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.llm_adapter import LLMAdapter
from modules.models.domain.prompt_service import PromptService
from modules.regulation_fragment.domain import Formalism
from modules.rules.application.rule_service import RuleService


class ExplanationService:
    """
    Service for generating explanations for regulation fragments.
    """

    def __init__(
            self,
            rule_service: RuleService,
            atom_service: AtomService,
            prompt_service: PromptService,
            llm_adapter: LLMAdapter
    ):
        self._rule_service = rule_service
        self._atom_service = atom_service
        self._prompt_service = prompt_service
        self._llm_adapter = llm_adapter

    def generate_examples_for_regulation_fragment(self, regulation_fragment_id: int) -> ExamplesDTO:
        """
        Generate examples for a regulation fragment using the LLM adapter.

        :param regulation_fragment_id: The ID of the regulation fragment.
        :return: The generated examples.
        """
        print("Generating examples for regulation fragment ID:", regulation_fragment_id)
        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment ID {regulation_fragment_id}.")
        valid_predicate_values = set(atom.predicate for atom in atoms if atom.predicate)

        rules = self._rule_service.get_rules_for_regulation_fragment(regulation_fragment_id)
        if not rules:
            raise ValueError(f"No rules found for regulation fragment ID {regulation_fragment_id}.")

        prompt_adapter = self._prompt_service.get(Formalism.PROLOG)

        example_prompt = prompt_adapter.example_generation_prompt(atoms, rules)

        message = ChatAgentMessageIngressDTO(
            regulation_fragment_id=regulation_fragment_id,
            user_prompt=example_prompt
        )

        response = self._llm_adapter.send_message(message)

        print("Received response from LLM")
        max_retries = 5

        parsed_response = None
        previous_messages: List[ContextMessageDTO] = []
        while max_retries > 0:
            try:
                parsed_response = ExamplesDTO.from_xml(response.message)

                # for some reason the LLMs really do not want to use the predicates I supply...
                predicate_deviations = []
                for ex in parsed_response.examples:
                    for fact in ex.facts:
                        if fact.predicate not in valid_predicate_values:
                            predicate_deviations.append(
                                f"Invalid predicate '{fact.predicate}' in example: {ex.description}. "
                                f"Valid predicates are: {valid_predicate_values}"
                            )

                if predicate_deviations:
                    raise ValueError(
                        "Invalid predicates used: " + ",\n".join(predicate_deviations)
                    )

                break
            except Exception as e:
                print("Error parsing response:", str(e))
                max_retries -= 1
                previous_messages.append(ContextMessageDTO(
                    type=ContextMessageType.USER,
                    content=example_prompt
                ))
                previous_messages.append(ContextMessageDTO(
                    type=ContextMessageType.AGENT,
                    content=response.message
                ))
                example_prompt = prompt_adapter.example_generation_retry_prompt(str(e))
                message = ChatAgentMessageIngressDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    user_prompt=example_prompt
                )
                print(previous_messages)
                response = self._llm_adapter.send_message(message, context_messages=previous_messages)

        print("Returning: " + str(parsed_response))
        return parsed_response

    def get_formalism_text(self, regulation_fragment_id: int) -> str:
        """
        Get the formalism text for a regulation fragment.

        :param regulation_fragment_id: The ID of the regulation fragment.
        :return: The formatted formalism text.
        """
        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment ID {regulation_fragment_id}.")

        rules = self._rule_service.get_rules_for_regulation_fragment(regulation_fragment_id)
        if not rules:
            raise ValueError(f"No rules found for regulation fragment ID {regulation_fragment_id}.")

        return format_prolog_knowledge_base(
            atoms=atoms,
            rules=rules,
        )
