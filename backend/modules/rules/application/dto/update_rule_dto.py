from typing import Optional
from pydantic import BaseModel


class UpdateRuleDTO(BaseModel):
    description: Optional[str] = None
    definition: Optional[str] = None
    is_goal: Optional[bool] = None