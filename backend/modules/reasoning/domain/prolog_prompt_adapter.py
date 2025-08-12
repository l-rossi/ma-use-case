from typing import List, Optional

from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.reasoning.domain.i_prompt_adapter import IPromptAdapter
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.rule_extraction_result_dto import RuleExtractionResultDTO


class PrologPromptAdapter(IPromptAdapter):
    """
    Adapter for Prolog prompts.
    """

    def __init__(self):
        with open("./prompts/atom_extraction/prolog_1.txt", "r") as file:
            self._atom_generation_prompt = file.read()

        with open("./prompts/atom_regeneration/prolog_1.txt", "r") as file:
            self._atom_regeneration_prompt = file.read()

    def chat_prompt(self, atoms: List[AtomDTO], rules: List[RuleDTO]):
        pass

    def rule_extraction_prompt(self, regulation_content: str, atom_string: str):
        pass

    def rule_regeneration_prompt(self, regulation_content: str, atom_string: str,
                                 previous_extraction_result: RuleExtractionResultDTO, feedback: Optional[str] = None):
        pass

    def rule_extraction_retry_prompt(self, original_prompt: str, previous_response: str, error_message: str):
        pass

    def atom_extraction_prompt(self, regulation_content: str):
        return self._atom_generation_prompt.format(
            regulation_content
        )

    def atom_regeneration_prompt(self, regulation_content: str, atoms: List[AtomDTO], feedback: str):
        return self._atom_regeneration_prompt.format(
            regulation_content,
            self._atoms_to_xml(regulation_content, atoms),
            feedback
        )
