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

from typing import List

from pydantic_xml import BaseXmlModel, wrapped
from pydantic_xml import element


class ExtractedRuleDTO(BaseXmlModel, tag='rule'):
    definition: str = element(tag='definition')
    description: str = element(tag='description')


class RuleExtractionResultDTO(BaseXmlModel, tag='result', arbitrary_types_allowed=True):
    # Mark this class as not exportable to JSON schema
    __pydantic_export__ = False

    rules: List[ExtractedRuleDTO] = wrapped("rules", element(default_factory=list))
    goals: List[ExtractedRuleDTO] = wrapped("goals", element(default_factory=list))