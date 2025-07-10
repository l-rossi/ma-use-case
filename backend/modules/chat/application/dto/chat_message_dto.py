from pydantic import BaseModel
from datetime import datetime


class ChatMessageDTO(BaseModel):
    id: int
    created_at: datetime
    message: str