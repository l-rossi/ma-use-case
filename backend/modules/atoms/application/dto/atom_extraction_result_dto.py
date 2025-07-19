from typing import List

from lxml import etree
from pydantic_xml import BaseXmlModel, wrapped, computed_element
from pydantic_xml import element, attr
from pydantic_xml.element.native import ElementT as Element


class ExtractedAtomDTO(BaseXmlModel, tag='atom'):
    id: int = attr(name="id")
    predicate: str


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
