from typing import List, Optional

from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.reasoning.domain.i_prompt_adapter import IPromptAdapter
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.rule_extraction_result_dto import RuleExtractionResultDTO, ExtractedRuleDTO


class PrologPromptAdapter(IPromptAdapter):
    """
    Adapter for Prolog prompts.
    """

    def __init__(self):
        with open("./prompts/atom_extraction/prolog_1.txt", "r") as file:
            self._atom_generation_prompt = file.read()

        with open("./prompts/atom_regeneration/prolog_1.txt", "r") as file:
            self._atom_regeneration_prompt = file.read()

        with open("./prompts/rule_extraction/prolog_1.txt", "r") as file:
            self._rule_extraction_prompt = file.read()

        with open("./prompts/rule_extraction/prolog_retry_1.txt", "r") as file:
            self._rule_extraction_retry_prompt = file.read()

        with open("./prompts/rule_regeneration/prolog_1.txt", "r") as file:
            self._rule_regeneration_prompt = file.read()

        with open("./prompts/chat/prolog_1.txt", "r") as file:
            self._chat_prompt = file.read()

    def chat_prompt(self,
                    regulation_content: str,
                    atoms: List[AtomDTO],
                    rules: List[RuleDTO]) -> str:
        formatted_atoms = "\n".join(
            f"{atom.predicate}: {atom.description}" for atom in atoms
        )
        formatted_rules = "\n".join(
            f"{rule.definition}: {rule.description}" for rule in rules
        )

        return self._chat_prompt.format(
            regulation_content,
            formatted_atoms,
            formatted_rules,
        )

    def rule_extraction_prompt(self,
                               regulation_content: str,
                               atoms: List[AtomDTO]) -> str:
        return self._rule_extraction_prompt.format(
            regulation_content,
            self._atom_predicates_as_list(atoms)
        )

    def rule_regeneration_prompt(self,
                                 regulation_content: str,
                                 atoms: List[AtomDTO],
                                 rules: List[RuleDTO],
                                 feedback: Optional[str]) -> str:
        formatted_rules = RuleExtractionResultDTO(
            rules=[ExtractedRuleDTO(description=rule.description, definition=rule.definition) for rule in rules if
                   not rule.is_goal],
            goals=[ExtractedRuleDTO(description=rule.description, definition=rule.definition) for rule in rules if
                   rule.is_goal]
        ).to_xml().encode("utf-8")

        return self._rule_regeneration_prompt.format(
            regulation_content,
            self._atom_predicates_as_list(atoms),
            formatted_rules,
            feedback or ""
        )

    def rule_extraction_retry_prompt(self,
                                     original_prompt: str,
                                     previous_response: str,
                                     error_message: str) -> str:
        return self._rule_extraction_retry_prompt.format(
            original_prompt,
            previous_response,
            error_message
        )

    def atom_extraction_prompt(self,
                               regulation_content: str) -> str:
        return self._atom_generation_prompt.format(
            regulation_content
        )

    def atom_regeneration_prompt(self,
                                 regulation_content: str,
                                 atoms: List[AtomDTO],
                                 feedback: str) -> str:
        return self._atom_regeneration_prompt.format(
            regulation_content,
            self._atoms_to_xml(regulation_content, atoms),
            feedback
        )
