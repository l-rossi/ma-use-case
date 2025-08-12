from typing import Dict

from modules.reasoning.domain.i_prompt_adapter import IPromptAdapter
from modules.reasoning.domain.prolog_prompt_adapter import PrologPromptAdapter
from modules.regulation_fragment.domain import Formalism


class PromptService:
    """
    Service for managing prompt adapters for different formalisms.
    """

    def __init__(self):
        self.adapters: Dict[Formalism, IPromptAdapter] = {
            Formalism.PROLOG: PrologPromptAdapter()
        }

    def get(self, formalism: Formalism) -> IPromptAdapter:
        """
        Retrieve the prompt adapter for the specified formalism.

        :param formalism: The formalism for which to retrieve the prompt adapter.
        :return:
        """
        if formalism not in self.adapters:
            raise ValueError(f"No prompt adapter found for formalism: {formalism}")

        return self.adapters[formalism]
