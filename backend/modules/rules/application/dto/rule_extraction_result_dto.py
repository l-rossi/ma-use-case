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