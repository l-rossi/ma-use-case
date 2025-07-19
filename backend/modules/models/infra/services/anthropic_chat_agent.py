import os
from typing import override

from anthropic import Anthropic

from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.infra.services.i_chat_agent import IChatAgent


class AnthropicAIChatAgent(IChatAgent):
    """
    Implementation of IChatAgent using the OpenAI API.
    """

    def __init__(self, agentic_log_service: AgenticLogService, model: str):
        """
        Initialize the OpenAI chat agent.
        
        Args:
            model (str, optional): The OpenAI model to use. Defaults to "gpt-3.5-turbo".
        """
        super().__init__(agentic_log_service)
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError(
                "Anthropic API key is required. Set the ANTHROPIC_API_KEY environment variable.")

        self.client = Anthropic(
            api_key=api_key
        )
        self.model = model

    def _send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Process a message and return a response using the OpenAI API.
        """

        try:
            response = self.client.messages.create(
                temperature=0,
                model=self.model,
                messages=[
                    {"role": "system", "content": message.system_prompt},
                    {"role": "user", "content": message.user_prompt}
                ]
            )
            return ChatAgentMessageEgressDTO(message=response.content[0].text)

        except Exception as e:
            # In a production environment, you might want to handle different types of exceptions differently
            # For now, we'll just return the error message
            print(f"Error calling OpenAI API: {str(e)}")
            return ChatAgentMessageEgressDTO(message=str(e), is_error=True)
