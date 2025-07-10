from pydantic import BaseModel
from datetime import datetime


class RegulationFragmentDTO(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime