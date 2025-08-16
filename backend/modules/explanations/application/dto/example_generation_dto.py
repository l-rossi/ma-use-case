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

