from datetime import datetime

from pydantic import BaseModel

from modules.chat.domain.agent import Agent


class ChatMessageDTO(BaseModel):
    id: int
    created_at: datetime
    content: str
    agent: Agent
