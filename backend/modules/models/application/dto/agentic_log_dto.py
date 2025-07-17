from datetime import datetime
from pydantic import BaseModel

from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO


class AgenticLogDTO(BaseModel):
    id: int
    log_entry: str
    message_source: str
    regulation_fragment_id: int
    created_at: datetime
