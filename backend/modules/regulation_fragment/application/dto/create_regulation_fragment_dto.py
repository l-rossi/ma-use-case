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

from typing import Optional

from pydantic import BaseModel

from modules.models.domain.llm_identifier import LLMIdentifier
from modules.regulation_fragment.domain import Formalism


class CreateRegulationFragmentDTO(BaseModel):
    title: str
    content: str
    source: Optional[str] = None
    llm_identifier: str
    formalism: Formalism = Formalism.PROLOG
    used_tokens_in: int = 0
    used_tokens_out: int = 0
