import os
from typing import List

from google import genai
from google.genai.types import GenerateContentConfig

from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.infra.services.i_chat_agent import IChatAgent


class GoogleChatAgent(IChatAgent):
    """
    Implementation of IChatAgent using the Google Generative AI API.
    """

    def __init__(self, agentic_log_service: AgenticLogService, model: str):
        """
        Initialize the Google chat agent.

        Args:
            model (str): The Google Generative AI model to use.
        """
        super().__init__(agentic_log_service)
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "Google API key is required. Set the GOOGLE_API_KEY environment variable.")

        # Configure the Google Generative AI client
        self.client = genai.Client(api_key=api_key)
        self.model = model

    def _send_message(self, message: ChatAgentMessageIngressDTO,
                      context_messages: List[ContextMessageDTO]) -> ChatAgentMessageEgressDTO:
        """
        Process a message and return a response using the Google Generative AI API.
        """

        try:
            contents = []

            for ctx_msg in context_messages:
                contents.append({
                    "role": "model" if ctx_msg.type.value == "agent" else "user",
                    "parts": [{"text": ctx_msg.content}]
                })

            # Add the current user prompt
            contents.append({
                "role": "user",
                "parts": [{"text": message.user_prompt}]
            })

            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
                config=GenerateContentConfig(
                    temperature=0.0,
                    system_instruction=message.system_prompt if message.system_prompt else None
                )
            )
            return ChatAgentMessageEgressDTO(message=response.text)

        except Exception as e:
            # In a production environment, you might want to handle different types of exceptions differently
            # For now, we'll just return the error message
            print(f"Error calling Google Generative AI API: {str(e)}")
            return ChatAgentMessageEgressDTO(message=str(e), is_error=True)
