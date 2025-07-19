from typing import Dict

from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.domain.llm_identifier import LLMIdentifier
from modules.models.infra.services.i_chat_agent import IChatAgent
from modules.models.infra.services.openai_chat_agent import OpenAIChatAgent
from modules.models.infra.services.anthropic_chat_agent import AnthropicAIChatAgent
from modules.models.infra.services.google_chat_agent import GoogleChatAgent
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService


class LLMAdapter:
    """
    Base class for LLM adapters.
    This class should be extended by specific LLM adapter implementations.
    """

    def __init__(self, agentic_log_service: AgenticLogService, regulation_fragment_service: RegulationFragmentService):
        self.agents: Dict[str, IChatAgent] = {
            LLMIdentifier.GPT_3_5_TURBO.value: OpenAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="gpt-3.5-turbo"),
            LLMIdentifier.GPT_4o_MINI.value: OpenAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="gpt-4o-mini"),
            LLMIdentifier.SONNET_4.value: AnthropicAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="claude-sonnet-4-20250514"),
            LLMIdentifier.GEMINI_2_5_FLASH.value: GoogleChatAgent(
                agentic_log_service=agentic_log_service,
                model="gemini-2.5-flash"),
        }
        self.regulation_fragment_service = regulation_fragment_service

    def send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Delegates the message to the appropriate agent based on the regulation fragment's LLM identifier.
        :param message:
        :return:
        """
        regulation = self.regulation_fragment_service.find_by_id(
            message.regulation_fragment_id
        )

        if regulation is None:
            raise ValueError(f"Regulation fragment with ID {message.regulation_fragment_id} not found.")

        agent = self.agents.get(regulation.llm_identifier)
        if agent is None:
            raise ValueError(f"No agent found for LLM identifier {regulation.llm_identifier}.")

        return agent.send_message(message)
