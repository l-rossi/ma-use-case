import os
from typing import List

from openai import OpenAI

from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.infra.services.i_chat_agent import IChatAgent


class OpenAIChatAgent(IChatAgent):
    """
    Implementation of IChatAgent using the OpenAI API.
    """

    def __init__(self, agentic_log_service: AgenticLogService, model="gpt-3.5-turbo"):
        """
        Initialize the OpenAI chat agent.

        Args:
            model (str, optional): The OpenAI model to use. Defaults to "gpt-3.5-turbo".
        """
        super().__init__(agentic_log_service)
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key is required.Set the OPENAI_API_KEY environment variable.")

        self.client = OpenAI(api_key=self.api_key)
        self.model = model

    def _send_message(self, message: ChatAgentMessageIngressDTO,
                      context_messages: List[ContextMessageDTO]) -> ChatAgentMessageEgressDTO:
        """
        Process a message and return a response using the OpenAI API.
        """

        try:
            messages = [
                {"role": "system", "content": message.system_prompt},
            ]

            # Add context messages if they exist
            for ctx_msg in context_messages:
                if ctx_msg.type.value == "user":
                    messages.append({"role": "user", "content": ctx_msg.content})
                elif ctx_msg.type.value == "agent":
                    messages.append({"role": "assistant", "content": ctx_msg.content})

            # Add the current user prompt
            messages.append({"role": "user", "content": message.user_prompt})

            has_temperature_param = self.model in [
                "gpt-3.5-turbo",
                "gpt-4o-mini"
            ]

            response = self.client.chat.completions.create(
                temperature=0 if has_temperature_param else 1,
                model=self.model,
                messages=messages
            )

            assistant_message = response.choices[0].message.content
            return ChatAgentMessageEgressDTO(message=assistant_message)

        except Exception as e:
            # In a production environment, you might want to handle different types of exceptions differently
            # For now, we'll just return the error message
            print(f"Error calling OpenAI API: {str(e)}")
            return ChatAgentMessageEgressDTO(message=str(e), is_error=True)
