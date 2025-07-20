from typing import List, Optional
from pydantic import BaseModel


class UpdateAtomDTO(BaseModel):
    predicate: Optional[str]
    description: Optional[str] = None
    is_negated: Optional[bool] = None
