from pydantic import BaseModel


class RegenerateRulesDTO(BaseModel):
    feedback: str