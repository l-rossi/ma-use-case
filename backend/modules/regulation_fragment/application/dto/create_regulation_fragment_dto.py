from typing import Optional

from pydantic import BaseModel

from modules.models.domain.llm_identifier import LLMIdentifier
from modules.regulation_fragment.domain import Formalism


class CreateRegulationFragmentDTO(BaseModel):
    title: str
    content: str
    source: Optional[str] = None
    llm_identifier: str
    formalism: Formalism = Formalism.PROLOG
    used_tokens_in: int = 0
    used_tokens_out: int = 0
