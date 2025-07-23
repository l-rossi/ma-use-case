from pydantic import BaseModel


class CreateRuleDTO(BaseModel):
    regulation_fragment_id: int
    description: str
    definition: str
    is_goal: bool = False