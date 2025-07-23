from pydantic import BaseModel


class CreateAtomDTO(BaseModel):
    regulation_fragment_id: int
    predicate: str
    description: str
    is_negated: bool
    is_fact: bool
