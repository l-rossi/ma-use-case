from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AgenticLogDTO(BaseModel):
    """
    Data Transfer Object for an agentic log.

    id: Unique identifier for the log
    user_prompt: The prompt issued by the human user
    system_prompt: Optional prompt issued from the application
    message_source: The source of the message (USER, SYSTEM, MODEL)
    regulation_fragment_id: ID of the regulation fragment this log is associated with
    created_at: When the log was created
    """
    id: int
    user_prompt: str
    system_prompt: Optional[str] = None
    message_source: str
    regulation_fragment_id: int
    created_at: datetime
