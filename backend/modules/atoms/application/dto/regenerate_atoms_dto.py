from pydantic import BaseModel


class RegenerateAtomsDTO(BaseModel):
    feedback: str