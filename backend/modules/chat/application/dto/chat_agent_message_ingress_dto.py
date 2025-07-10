import dataclasses
from pydantic import BaseModel


class ChatAgentMessageIngressDTO(BaseModel):
    user_prompt: str
    system_prompt: str
