from pydantic import BaseModel


class PrologResultDTO(BaseModel):
    variable: str
    value: str
