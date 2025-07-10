import dataclasses
from pydantic import BaseModel


class ChatAgentMessageEgressDTO(BaseModel):
    message: str
    is_error: bool = False
