from datetime import datetime

from pydantic import BaseModel


class RuleDTO(BaseModel):
    id: int
    regulation_fragment_id: int
    description: str
    definition: str
    is_goal: bool
    created_at: datetime