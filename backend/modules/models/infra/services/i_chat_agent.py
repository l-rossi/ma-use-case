from abc import ABC, abstractmethod

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

    def send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Process a message to a model and return a response. This method logs the message and then calls the internal
        `_send_message` method to handle the actual message sending.
        :param message:
        :return:
        """
        regulation_fragment_id = message.regulation_fragment_id
        self.agentic_log_service.create(
            CreateAgenticLogDTO(
                log_entry=message.user_prompt,
                message_source=MessageSource.USER_PROMPT,
                regulation_fragment_id=regulation_fragment_id,
            )
        )
        if message.system_prompt:
            self.agentic_log_service.create(
                CreateAgenticLogDTO(
                    log_entry=message.system_prompt,
                    message_source=MessageSource.SYSTEM_PROMPT,
                    regulation_fragment_id=regulation_fragment_id,
                )
            )

        response = self._send_message(message)
        self.agentic_log_service.create(
            CreateAgenticLogDTO(
                log_entry=response.message if not response.is_error else f"[ERROR] {response.error_message}",
                message_source=MessageSource.MODEL_RESPONSE,
                regulation_fragment_id=regulation_fragment_id,
            )
        )
        return response

    @abstractmethod
    def _send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Internal method to send a message. This is intended to be overridden by subclasses.
        """
        raise NotImplementedError("This method should be overridden by subclasses.")
