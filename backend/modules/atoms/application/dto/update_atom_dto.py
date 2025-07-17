from pydantic import BaseModel


class UpdateAtomDTO(BaseModel):
    description: str
