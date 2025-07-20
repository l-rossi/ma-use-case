from pydantic import BaseModel

from modules.chat.domain.context_message_type import ContextMessageType


class ContextMessageDTO(BaseModel):
    type: ContextMessageType
    content: str