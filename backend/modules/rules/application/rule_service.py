import sys
from itertools import chain
from typing import List, Optional, Tuple

from modules.atoms.application.atom_service import AtomService
from modules.atoms.application.atom_util import mask_variables_in_atoms, create_wildcard_predicates
from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.llm_adapter import LLMAdapter
from modules.reasoning.application.dto.prolog_result_dto import PrologAnswerDTO
from modules.reasoning.application.prolog_reasoner import PrologReasoner
from modules.models.domain.prompt_service import PromptService
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from modules.regulation_fragment.domain import Formalism
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.application.dto.regenerate_rules_dto import RegenerateRulesDTO
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.rule_extraction_result_dto import RuleExtractionResultDTO
from modules.rules.application.dto.update_rule_dto import UpdateRuleDTO
from modules.rules.infra.rule_repository import RuleRepository


class RuleService:
    """
    Service for managing rules.
    Provides methods for creating, updating, and retrieving rules.
    """

    def __init__(self, rule_repository: RuleRepository, regulation_fragment_service: RegulationFragmentService,
                 chat_agent: LLMAdapter, prolog_reasoner: PrologReasoner,
                 atom_service: AtomService, prompt_service: PromptService):
        self._rule_repository = rule_repository
        self._regulation_fragment_service = regulation_fragment_service
        self._chat_agent = chat_agent
        self._prolog_reasoner = prolog_reasoner
        self._atom_service = atom_service
        self._prompt_service = prompt_service

        self._retry_limit = 4

    def create_rule(self, rule_data: CreateRuleDTO) -> RuleDTO:
        """
        Create a new rule.
        
        Args:
            rule_data: The data for the new rule
            
        Returns:
            The created rule as a DTO
        """
        rule = self._rule_repository.save(rule_data)
        return RuleDTO(
            id=rule.id,
            regulation_fragment_id=rule.regulation_fragment_id,
            description=rule.description,
            definition=rule.definition,
            is_goal=rule.is_goal,
            created_at=rule.created_at
        )

    def update_rule(self, rule_id: int, rule_data: UpdateRuleDTO) -> Optional[RuleDTO]:
        """
        Update an existing rule.
        
        Args:
            rule_id: The ID of the rule to update
            rule_data: The data to update the rule with
            
        Returns:
            The updated rule as a DTO or None if the rule was not found
        """
        rule = self._rule_repository.update(rule_id, rule_data)
        if rule is None:
            return None

        return RuleDTO(
            id=rule.id,
            regulation_fragment_id=rule.regulation_fragment_id,
            description=rule.description,
            definition=rule.definition,
            is_goal=rule.is_goal,
            created_at=rule.created_at
        )

    def get_rules_for_regulation_fragment(self, regulation_fragment_id: int) -> List[RuleDTO]:
        """
        Get all rules for a specific regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            A list of rule DTOs for the specified regulation fragment
        """
        rules = self._rule_repository.find_by_regulation_id(regulation_fragment_id)
        return [
            RuleDTO(
                id=rule.id,
                regulation_fragment_id=rule.regulation_fragment_id,
                description=rule.description,
                definition=rule.definition,
                is_goal=rule.is_goal,
                created_at=rule.created_at
            )
            for rule in rules
        ]

    def get_rule_by_id(self, rule_id: int) -> Optional[RuleDTO]:
        """
        Get a rule by its ID.
        
        Args:
            rule_id: The ID of the rule to get
            
        Returns:
            The rule as a DTO or None if not found
        """
        rule = self._rule_repository.find_by_id(rule_id)
        if rule is None:
            return None

        return RuleDTO(
            id=rule.id,
            regulation_fragment_id=rule.regulation_fragment_id,
            description=rule.description,
            definition=rule.definition,
            is_goal=rule.is_goal,
            created_at=rule.created_at
        )

    def delete_rule(self, rule_id: int) -> bool:
        """
        Delete a rule by its ID.
        
        Args:
            rule_id: The ID of the rule to delete
            
        Returns:
            True if the rule was deleted, False if it wasn't found
        """
        return self._rule_repository.delete_by_id(rule_id)

    def delete_rules_for_regulation_fragment(self, regulation_fragment_id: int) -> int:
        """
        Delete all rules for a specific regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            The number of rules deleted
        """
        rules = self.get_rules_for_regulation_fragment(regulation_fragment_id)
        count = 0
        for rule in rules:
            if self.delete_rule(rule.id):
                count += 1
        return count

    def generate_rules_for_regulation_fragment(self, regulation_fragment_id: int) -> None:
        """
        Generate rules for a specific regulation fragment.
        This method implements the logic to generate rules based on the regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            None
        """
        regulation = self._regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not regulation:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        existing_rules = self.get_rules_for_regulation_fragment(regulation_fragment_id)
        if existing_rules:
            print(f"Rules already exist for regulation fragment {regulation_fragment_id}. Skipping generation.")
            return

        print(f"Generating rules for regulation fragment {regulation_fragment_id}...")

        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment {regulation_fragment_id}. Cannot generate rules.")

        input_message = self._prompt_service.get(regulation.formalism).rule_extraction_prompt(
            regulation.content,
            atoms,
        )

        returned_message = self._chat_agent.send_message(
            ChatAgentMessageIngressDTO(
                user_prompt=input_message,
                system_prompt='',
                regulation_fragment_id=regulation_fragment_id
            )
        )

        if returned_message.is_error:
            raise ValueError(f"Error generating rules: {returned_message.message}")

        parsed_result = RuleExtractionResultDTO.from_xml(returned_message.message)

        retries_remaining = self._retry_limit
        syntax_correct, err = self._check_rule_syntax(parsed_result, atoms, formalism=regulation.formalism)
        while retries_remaining > 0 and not syntax_correct:
            print(f"Rule syntax error: {err}. Retrying... ({retries_remaining} attempts left)")
            retries_remaining -= 1

            retry_message = self._prompt_service.get(
                regulation.formalism
            ).rule_extraction_retry_prompt(
                input_message,
                str(returned_message),
                str(err),
            )

            returned_message = self._chat_agent.send_message(
                ChatAgentMessageIngressDTO(
                    user_prompt=retry_message,
                    system_prompt='',
                    regulation_fragment_id=regulation_fragment_id
                )
            )
            # This bloats the message with too much old prompting. This needs to be improved.
            input_message = retry_message

            if returned_message.is_error:
                raise ValueError(f"Error regenerating rules: {returned_message.message}")

            parsed_result = RuleExtractionResultDTO.from_xml(returned_message.message)
            syntax_correct, err = self._check_rule_syntax(parsed_result, atoms, regulation.formalism)

        if not syntax_correct:
            # raise ValueError(f"Failed to generate valid rules after {self.retry_limit} attempts. Last error: {err}")
            pass

        self._save_extracted_rules(parsed_result, regulation_fragment_id)

    def regenerate_rules_for_regulation_fragment(self, regulation_fragment_id: int,
                                                 regenerate_data: RegenerateRulesDTO = None) -> None:
        """
        Regenerate rules for a specific regulation fragment.
        This method deletes existing rules and generates new ones based on feedback.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            regenerate_data: Optional feedback data for regeneration
            
        Returns:
            None
        """
        print(f"Regenerating rules for regulation fragment {regulation_fragment_id}...")

        fragment = self._regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not fragment:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        rules = self.get_rules_for_regulation_fragment(regulation_fragment_id)
        if not rules:
            raise ValueError(f"No rules found for regulation fragment {regulation_fragment_id}.")

        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(
                f"No atoms found for regulation fragment {regulation_fragment_id}. Cannot regenerate rules.")

        regeneration_request = self._prompt_service.get(
            fragment.formalism
        ).rule_regeneration_prompt(
            fragment.content,
            atoms,
            rules,
            regenerate_data.feedback if regenerate_data else ""
        )

        response = self._chat_agent.send_message(
            ChatAgentMessageIngressDTO(
                user_prompt=regeneration_request,
                regulation_fragment_id=regulation_fragment_id,
            )
        )
        if response.is_error:
            raise ValueError(f"Error regenerating rules: {response.message}")

        regenerated_result = RuleExtractionResultDTO.from_xml(response.message)
        self.delete_rules_for_regulation_fragment(regulation_fragment_id)
        self._save_extracted_rules(regenerated_result, regulation_fragment_id)

    def _check_rule_syntax(self, result: RuleExtractionResultDTO, atoms: List[AtomDTO], formalism: Formalism) -> Tuple[
        bool, List[PrologAnswerDTO]]:
        """
        Check if a rule definition has valid Prolog syntax.

        The idea is to take the atoms with wildcard variables as a fact base,
        adding the rules and goals as Prolog rules,
        and creating an artificial "violation" predicate which should
        match the first goal in the result in the number of variables.
        
        Args:
            result: The rule definitions to check
            
        Returns:
            True if the rule has valid syntax, False otherwise
        """
        if formalism != Formalism.PROLOG:
            print(
                f"Syntax check is only implemented for Prolog formalism, but got {formalism}. Skipping syntax check.",
                file=sys.stderr
            )
            return True, []

        try:
            facts = "\n".join(mask_variables_in_atoms(a for a in atoms if a.is_fact))
            knowledge_base = "\n".join(
                x.definition for x in chain(result.rules, result.goals)
            )

            masked_violation, _ = create_wildcard_predicates(result.goals[0].definition.split(":-")[0].strip(),
                                                             wildcard_factory=lambda _: "_")

            print(
                facts + "\n" + knowledge_base
            )
            print(masked_violation)

            result_status, response = self._prolog_reasoner.execute_prolog(facts + "\n" + knowledge_base,
                                                                           masked_violation)
            return result_status != "error", response
        except Exception as e:
            print(f"Error checking rule syntax: {str(e)}")
            return False, [PrologAnswerDTO(
                status='error',
                message=str(e),
                answers=[]
            )]

    def _save_extracted_rules(self, parsed_result: RuleExtractionResultDTO, regulation_fragment_id: int) -> None:
        """
        Save the extracted rules and goals to the database.
        
        Args:
            parsed_result: The parsed result containing the extracted rules and goals
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            None
        """
        for rule in parsed_result.rules:
            self._rule_repository.save(
                CreateRuleDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    description=rule.description,
                    definition=rule.definition,
                    is_goal=False
                )
            )

        for goal in parsed_result.goals:
            self._rule_repository.save(
                CreateRuleDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    description=goal.description,
                    definition=goal.definition,
                    is_goal=True
                )
            )
