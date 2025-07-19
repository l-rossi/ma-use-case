from pydantic import BaseModel


class ChatAgentMessageIngressDTO(BaseModel):
    regulation_fragment_id: int
    user_prompt: str
    system_prompt: str = ""
