from pydantic import BaseModel


class PrologQueryDTO(BaseModel):
    src_text: str
    goal: str