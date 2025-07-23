from pydantic import BaseModel
from typing import Optional

from modules.models.domain.message_source import MessageSource


class CreateAgenticLogDTO(BaseModel):
    """
    Data Transfer Object for creating an agentic log.

    user_prompt: The prompt issued by the human user
    system_prompt: Optional prompt issued from the application
    message_source: The source of the message (USER, SYSTEM, MODEL)
    regulation_fragment_id: ID of the regulation fragment this log is associated with
    is_error: Whether this log entry represents an error message
    """
    user_prompt: str
    system_prompt: Optional[str] = None
    message_source: MessageSource
    regulation_fragment_id: int
    is_error: bool = False

    class Config:
        use_enum_values = True
        extra = "forbid"