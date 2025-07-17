from typing import List

from pydantic_xml import BaseXmlModel, wrapped, computed_element
from pydantic_xml import element, attr
from pydantic_xml.element.native import ElementT as Element
from lxml import etree


class ExtractedAtomDTO(BaseXmlModel, tag='atom'):
    id: int = attr(name="id")
    predicate: str


class AtomExtractionResultDTO(BaseXmlModel, tag='result', arbitrary_types_allowed=True):
    annotated_raw: Element = element(tag='annotated')
    atoms: List[ExtractedAtomDTO] = wrapped("atoms", element(default_factory=list))

    @computed_element
    def annotated(self) -> str:
        # Impossible ChatGPT said... witness my defiance!
        # Shitty code shall prevail!
        return (self.annotated_raw.text or '') + ''.join(
            etree.tostring(child, encoding='unicode') + (child.tail or '')
            for child in self.annotated_raw
        )
