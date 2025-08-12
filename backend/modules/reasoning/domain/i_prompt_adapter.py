from abc import ABC
from typing import List

from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.rules.application.dto.rule_dto import RuleDTO


class IPromptService(ABC):

    def chat_prompt(self,
                    atoms: List[AtomDTO],
                    rules: List[RuleDTO],
                    ):
        raise NotImplementedError()
