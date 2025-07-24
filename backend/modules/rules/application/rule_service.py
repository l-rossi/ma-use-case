from typing import List, Optional, Tuple

from modules.atoms.application.atom_service import AtomService
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.llm_adapter import LLMAdapter
from modules.reasoning import PrologReasoner
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.application.dto.regenerate_rules_dto import RegenerateRulesDTO
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.rule_extraction_result_dto import RuleExtractionResultDTO, ExtractedRuleDTO
from modules.rules.application.dto.update_rule_dto import UpdateRuleDTO
from modules.rules.infra.rule_repository import RuleRepository


class RuleService:
    """
    Service for managing rules.
    Provides methods for creating, updating, and retrieving rules.
    """

    def __init__(self, rule_repository: RuleRepository, regulation_fragment_service: RegulationFragmentService,
                 chat_agent: LLMAdapter, prolog_reasoner: PrologReasoner,
                 atom_service: AtomService):
        self.rule_repository = rule_repository
        self.regulation_fragment_service = regulation_fragment_service
        self.chat_agent = chat_agent
        self.prolog_reasoner = prolog_reasoner
        self.atom_service = atom_service

        self.retry_limit = 4

        with open("./prompts/rule_extraction/prolog_1.txt", "r") as file:
            self.generation_prompt = file.read()

        with open("./prompts/rule_regeneration/prolog_1.txt", "r") as file:
            self.regeneration_prompt = file.read()

        with open("./prompts/rule_extraction/prolog_retry_1.txt", "r") as file:
            self.retry_prompt = file.read()

    def create_rule(self, rule_data: CreateRuleDTO) -> RuleDTO:
        """
        Create a new rule.
        
        Args:
            rule_data: The data for the new rule
            
        Returns:
            The created rule as a DTO
        """
        rule = self.rule_repository.save(rule_data)
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
        rule = self.rule_repository.update(rule_id, rule_data)
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

    def get_rules_by_regulation_id(self, regulation_fragment_id: int) -> List[RuleDTO]:
        """
        Get all rules for a specific regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            A list of rule DTOs for the specified regulation fragment
        """
        rules = self.rule_repository.find_by_regulation_id(regulation_fragment_id)
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
        rule = self.rule_repository.find_by_id(rule_id)
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
        return self.rule_repository.delete_by_id(rule_id)

    def delete_rules_for_regulation_fragment(self, regulation_fragment_id: int) -> int:
        """
        Delete all rules for a specific regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            The number of rules deleted
        """
        rules = self.get_rules_by_regulation_id(regulation_fragment_id)
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
        regulation = self.regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not regulation:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        existing_rules = self.get_rules_by_regulation_id(regulation_fragment_id)
        if existing_rules:
            print(f"Rules already exist for regulation fragment {regulation_fragment_id}. Skipping generation.")
            return

        print(f"Generating rules for regulation fragment {regulation_fragment_id}...")

        atoms = self.atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment {regulation_fragment_id}. Cannot generate rules.")

        # Separate facts from non-facts
        fact_atoms = [atom for atom in atoms if atom.is_fact]
        other_atoms = [atom for atom in atoms if not atom.is_fact]

        # Create strings for facts and other atoms
        fact_string = '\n'.join(f"{atom.predicate}." for atom in fact_atoms)
        other_atom_string = '\n'.join(atom.predicate for atom in other_atoms)

        # Combine them with a clear separation
        atom_string = f"# Facts (to be asserted directly):\n{fact_string}\n\n# Other atoms (to be used in rules):\n{other_atom_string}"

        input_message = self.generation_prompt.format(
            regulation.content,
            atom_string,
        )

        returned_message = self.chat_agent.send_message(
            ChatAgentMessageIngressDTO(
                user_prompt=input_message,
                system_prompt='',
                regulation_fragment_id=regulation_fragment_id
            )
        )

        if returned_message.is_error:
            raise ValueError(f"Error generating rules: {returned_message.message}")

        parsed_result = RuleExtractionResultDTO.from_xml(returned_message.message)

        # retries_remaining = self.retry_limit
        # syntax_correct, err = self._check_rule_syntax(parsed_result)
        # while retries_remaining > 0 and not syntax_correct:
        #     print(f"Rule syntax error: {err}. Retrying... ({retries_remaining} attempts left)")
        #     retries_remaining -= 1
        #
        #     retry_message = self.retry_prompt.format(
        #         input_message,
        #         returned_message,
        #         err,
        #     )
        #
        #     returned_message = self.chat_agent.send_message(
        #         ChatAgentMessageIngressDTO(
        #             user_prompt=retry_message,
        #             system_prompt='',
        #             regulation_fragment_id=regulation_fragment_id
        #         )
        #     )
        #     input_message = retry_message
        #
        #     if returned_message.is_error:
        #         raise ValueError(f"Error regenerating rules: {returned_message.message}")
        #
        #     parsed_result = RuleExtractionResultDTO.from_xml(returned_message.message)
        #     syntax_correct, err = self._check_rule_syntax(parsed_result)

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

        fragment = self.regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not fragment:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        rules = self.get_rules_by_regulation_id(regulation_fragment_id)
        if not rules:
            raise ValueError(f"No rules found for regulation fragment {regulation_fragment_id}.")

        atoms = self.atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(
                f"No atoms found for regulation fragment {regulation_fragment_id}. Cannot regenerate rules.")

        res = RuleExtractionResultDTO(
            rules=[ExtractedRuleDTO(description=rule.description, definition=rule.definition) for rule in rules if
                   not rule.is_goal],
            goals=[ExtractedRuleDTO(description=rule.description, definition=rule.definition) for rule in rules if
                   rule.is_goal]
        )

        # Separate facts from non-facts
        fact_atoms = [atom for atom in atoms if atom.is_fact]
        other_atoms = [atom for atom in atoms if not atom.is_fact]

        # Create strings for facts and other atoms
        fact_string = '\n'.join(f"{atom.predicate}." for atom in fact_atoms)
        other_atom_string = '\n'.join(atom.predicate for atom in other_atoms)

        # Combine them with a clear separation
        atom_string = f"# Facts (to be asserted directly):\n{fact_string}\n\n# Other atoms (to be used in rules):\n{other_atom_string}"

        regeneration_request = self.regeneration_prompt.format(
            fragment.content,  # Original Statement
            atom_string,  # Input Atoms
            res.to_xml().encode("utf-8"),  # Previous extraction result
            regenerate_data.feedback if regenerate_data else ""  # Feedback for regeneration
        )

        response = self.chat_agent.send_message(
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

    def _check_rule_syntax(self, result: RuleExtractionResultDTO) -> Tuple[bool, str]:
        """
        Check if a rule definition has valid Prolog syntax.
        
        Args:
            result: The rule definitions to check
            
        Returns:
            True if the rule has valid syntax, False otherwise
        """
        try:
            # At this point we do not really care about the actual content of the rules,
            knowledge_base = "\n".join(x.definition for x in result.rules)
            goal = "\n".join(x.definition for x in result.goals)

            result_status, response = self.prolog_reasoner.execute_prolog(knowledge_base, goal)
            return result_status != "error", response[0].value
        except Exception as e:
            print(f"Error checking rule syntax: {str(e)}")
            return False, str(e)

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
            self.rule_repository.save(
                CreateRuleDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    description=rule.description,
                    definition=rule.definition,
                    is_goal=False
                )
            )

        for goal in parsed_result.goals:
            self.rule_repository.save(
                CreateRuleDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    description=goal.description,
                    definition=goal.definition,
                    is_goal=True
                )
            )
