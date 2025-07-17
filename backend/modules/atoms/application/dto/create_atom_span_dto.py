from pydantic import BaseModel

class CreateAtomSpanDTO(BaseModel):
    atom_id: int
    start: int
    end: int
