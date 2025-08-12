from abc import ABC, abstractmethod
from typing import List, Optional

from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO
from modules.models.domain.message_source import MessageSource


class IChatAgent(ABC):
    def __init__(self, agentic_log_service: AgenticLogService):
        """
        Initialize the chat agent with a logging service.

        :param agentic_log_service: Service to log messages.
        """
        self.agentic_log_service = agentic_log_service

    def send_message(self, message: ChatAgentMessageIngressDTO,
                     context_messages: Optional[List[ContextMessageDTO]] = None) -> ChatAgentMessageEgressDTO:
        """
        Process a message to a model and return a response. This method logs the message and then calls the internal
        `_send_message` method to handle the actual message sending.
        :param context_messages: Additional previous messages, e.g., previous messages in a chat.
        :param message: The message to be sent to the LLM.
        :return:
        """
        regulation_fragment_id = message.regulation_fragment_id
        self.agentic_log_service.create(
            CreateAgenticLogDTO(
                user_prompt=message.user_prompt,
                system_prompt=message.system_prompt,
                message_source=MessageSource.SYSTEM_PROMPT,
                regulation_fragment_id=regulation_fragment_id,
                is_error=False
            )
        )

        response = self._send_message(message, context_messages=context_messages or [])
        self.agentic_log_service.create(
            CreateAgenticLogDTO(
                user_prompt=response.message if not response.is_error else f"[ERROR] {response.message}",
                system_prompt=None,
                message_source=MessageSource.MODEL_RESPONSE,
                regulation_fragment_id=regulation_fragment_id,
                is_error=response.is_error
            )
        )
        return response

    @abstractmethod
    def _send_message(self, message: ChatAgentMessageIngressDTO,
                      context_messages: List[ContextMessageDTO]) -> ChatAgentMessageEgressDTO:
        """
        Internal method to send a message. This is intended to be overridden by subclasses.
        """
        raise NotImplementedError("This method should be overridden by subclasses.")
