from pydantic import BaseModel


class CreateChatMessageDTO(BaseModel):
    content: str