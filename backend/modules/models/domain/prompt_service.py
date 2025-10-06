"""
Leveraging Legal Information Representation for Business Process Compliance
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
"""

from typing import Dict

from modules.models.domain.i_prompt_adapter import IPromptAdapter
from modules.models.domain.prolog_prompt_adapter import PrologPromptAdapter
from modules.regulation_fragment.domain import Formalism


class PromptService:
    """
    Service for managing prompt adapters for different formalisms.
    """

    def __init__(self):
        self._adapters: Dict[Formalism, IPromptAdapter] = {
            Formalism.PROLOG: PrologPromptAdapter()
        }

    def get(self, formalism: Formalism) -> IPromptAdapter:
        """
        Retrieve the prompt adapter for the specified formalism.

        :param formalism: The formalism for which to retrieve the prompt adapter.
        :return:
        """
        if formalism not in self._adapters:
            raise ValueError(f"No prompt adapter found for formalism: {formalism}")

        return self._adapters[formalism]
