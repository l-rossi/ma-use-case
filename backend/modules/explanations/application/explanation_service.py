from typing import List

from modules.atoms.application.atom_service import AtomService
from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.chat.domain.context_message_type import ContextMessageType
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

        return ExamplesDTO.from_xml("""<examples>
    <example>
        <description>This "green path" example demonstrates a scenario where personal data is collected, processed lawfully (due to explicit consent), and subsequently deleted within the required timeframe. This set of facts ensures that no data retention or processing violations occur according to the defined rules.</description>
        <facts>
            <fact>
                <predicate>personal_data(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>collected(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>processed(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>individual(Individual)</predicate>
                <arguments>
                    <argument>
                        <variable>Individual</variable>
                        <value>john_doe</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>has_given_explicit_consent(Individual, Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Individual</variable>
                        <value>john_doe</value>
                    </argument>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>deleted(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>is_deleted_within_30_days_of_purpose_fulfillment(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>user_profile_data</value>
                    </argument>
                </arguments>
            </fact>
        </facts>
    </example>
    <example>
        <description>This failure case illustrates multiple violations: personal data is collected and processed without a legal basis (neither explicit consent nor contract necessity), leading to an "unlawful_processing" violation. Furthermore, since the data is not deleted and its retention is not allowed, it also triggers "data_not_deleted_at_all" and "not_deleted_on_time" violations.</description>
        <facts>
            <fact>
                <predicate>personal_data(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>customer_email</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>collected(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>customer_email</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>processed(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>customer_email</value>
                    </argument>
                </arguments>
            </fact>
        </facts>
    </example>
    <example>
        <description>This edge case demonstrates a scenario where personal data is collected and processed, but the individual explicitly requests its retention. This fact set shows that even if the data is not deleted, it does not lead to "data_not_deleted_at_all" or "not_deleted_on_time" violations because retention is explicitly allowed. Processing is lawful due to contract necessity.</description>
        <facts>
            <fact>
                <predicate>personal_data(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>order_history</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>collected(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>order_history</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>processed(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>order_history</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>individual(Individual)</predicate>
                <arguments>
                    <argument>
                        <variable>Individual</variable>
                        <value>jane_doe</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>has_explicitly_requested_data_retention(Individual, Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Individual</variable>
                        <value>jane_doe</value>
                    </argument>
                    <argument>
                        <variable>Data</variable>
                        <value>order_history</value>
                    </argument>
                </arguments>
            </fact>
            <fact>
                <predicate>is_necessary_for_contract_performance(Data)</predicate>
                <arguments>
                    <argument>
                        <variable>Data</variable>
                        <value>order_history</value>
                    </argument>
                </arguments>
            </fact>
        </facts>
    </example>
</examples>""")
