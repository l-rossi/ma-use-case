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

from pydantic import constr
from pydantic_xml import BaseXmlModel, element, wrapped


class Argument(BaseXmlModel, tag='argument', extra = "forbid"):
    variable: str = element(tag='variable')
    value: str = element(tag='value')


class Fact(BaseXmlModel, tag='fact', extra = "forbid"):
    predicate: str = element(tag='predicate')
    arguments: List[Argument] = wrapped("arguments", element(default_factory=list))


class Example(BaseXmlModel, tag='example', extra = "forbid"):
    description: constr(strip_whitespace=True) = element(tag='description')
    facts: List[Fact] = wrapped("facts", element(default_factory=list))



class ExamplesDTO(BaseXmlModel, tag='examples', extra = "forbid"):
    examples: List[Example] = element(default_factory=list)

