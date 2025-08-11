from pydantic import BaseModel


class PrologQueryDTO(BaseModel):
    facts: str