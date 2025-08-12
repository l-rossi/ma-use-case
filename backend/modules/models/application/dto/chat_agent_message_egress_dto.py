from pydantic import BaseModel


class ChatAgentMessageEgressDTO(BaseModel):
    message: str
    is_error: bool = False
    input_tokens: int = 0
    output_tokens: int = 0
