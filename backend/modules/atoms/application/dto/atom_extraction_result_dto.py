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

from lxml import etree
from pydantic_xml import BaseXmlModel, wrapped, computed_element
from pydantic_xml import element, attr
from pydantic_xml.element.native import ElementT as Element


class ExtractedAtomDTO(BaseXmlModel, tag='atom'):
    id: int = attr(name="id")
    predicate: str = element(tag='predicate')
    description: str = element(tag='description')
    is_fact: bool = element(name="is_fact", default=False)



# TODO Atom is a bad name as it conflicts with the Prolog concept of an atom.
class AtomExtractionResultDTO(BaseXmlModel, tag='result', arbitrary_types_allowed=True):
    # Mark this class as not exportable to JSON schema
    __pydantic_export__ = False

    annotated_raw: Element = element(tag='annotated')
    atoms: List[ExtractedAtomDTO] = wrapped("atoms", element(default_factory=list))

    @computed_element
    def annotated(self) -> str:
        return ((self.annotated_raw.text or '') + ''.join(
            etree.tostring(child, encoding='unicode')
            for child in self.annotated_raw
        )).strip()
