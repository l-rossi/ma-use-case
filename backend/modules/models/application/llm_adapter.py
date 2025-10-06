"""
Leveraging Legal Information Representation for Business Process Compliance
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
"""

from typing import Dict, Optional, List

from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.domain.llm_identifier import LLMIdentifier
from modules.models.infra.services.anthropic_chat_agent import AnthropicAIChatAgent
from modules.models.infra.services.google_chat_agent import GoogleChatAgent
from modules.models.infra.services.i_chat_agent import IChatAgent
from modules.models.infra.services.openai_chat_agent import OpenAIChatAgent
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
            LLMIdentifier.GPT_5.value: OpenAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="gpt-5"),
            LLMIdentifier.GPT_5_MINI.value: OpenAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="gpt-5-mini"),
            LLMIdentifier.GPT_5_NANO.value: OpenAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="gpt-5-nano"),
            LLMIdentifier.SONNET_4.value: AnthropicAIChatAgent(
                agentic_log_service=agentic_log_service,
                model="claude-sonnet-4-20250514"),
            LLMIdentifier.GEMINI_2_5_FLASH.value: GoogleChatAgent(
                agentic_log_service=agentic_log_service,
                model="gemini-2.5-flash"),
        }
        self.regulation_fragment_service = regulation_fragment_service

    def send_message(self, message: ChatAgentMessageIngressDTO,
                     context_messages: Optional[List[ContextMessageDTO]] = None) -> ChatAgentMessageEgressDTO:
        """
        Delegates the message to the appropriate agent based on the regulation fragment's LLM identifier.
        Intercepts the response to save token usage information to the database.

        :param context_messages: Optional list of context messages to include in the request.
        :param message: The message to be sent to the LLM.
        :return: The response from the LLM with token usage information.
        """
        regulation = self.regulation_fragment_service.find_by_id(
            message.regulation_fragment_id
        )

        if regulation is None:
            raise ValueError(f"Regulation fragment with ID {message.regulation_fragment_id} not found.")

        agent = self.agents.get(regulation.llm_identifier)
        if agent is None:
            raise ValueError(f"No agent found for LLM identifier {regulation.llm_identifier}.")

        response = agent.send_message(message, context_messages)
        self.regulation_fragment_service.increment_tokens(
            message.regulation_fragment_id,
            response.input_tokens,
            response.output_tokens
        )

        return response
