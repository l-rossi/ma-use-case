from pydantic import BaseModel


class AtomSpanDTO(BaseModel):
    id: int
    atom_id: int
    start: int
    end: int