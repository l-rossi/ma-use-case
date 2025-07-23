from datetime import datetime

from pydantic import BaseModel

from modules.models.domain.llm_identifier import LLMIdentifier


class RegulationFragmentDTO(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    llm_identifier: LLMIdentifier

    class Config:
        use_enum_values = True
        extra = "forbid"
