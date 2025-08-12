from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from modules.models.domain.llm_identifier import LLMIdentifier
from modules.regulation_fragment.domain import Formalism


class RegulationFragmentDTO(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    source: Optional[str] = None
    llm_identifier: LLMIdentifier
    formalism: Formalism = Formalism.PROLOG
    used_tokens_in: int = 0
    used_tokens_out: int = 0

    class Config:
        use_enum_values = True
        extra = "forbid"
