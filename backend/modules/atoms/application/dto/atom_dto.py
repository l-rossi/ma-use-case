from typing import List
from pydantic import BaseModel
from .atom_span_dto import AtomSpanDTO


class AtomDTO(BaseModel):
    id: int
    regulation_fragment_id: int
    predicate: str
    description: str
    is_negated: bool
    spans: List[AtomSpanDTO]