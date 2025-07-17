from pydantic import BaseModel

from modules.models.domain.message_source import MessageSource


class CreateAgenticLogDTO(BaseModel):
    log_entry: str
    message_source: MessageSource
    regulation_fragment_id: int
