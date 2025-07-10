import os
from openai import OpenAI

from backend.modules.chat.application.dto.chat_agent_message_egress_dto import ChatAgentMessageEgressDTO
from backend.modules.chat.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from backend.modules.chat.infra.services.i_chat_agent import IChatAgent


class OpenAIChatAgent(IChatAgent):
    """
    Implementation of IChatAgent using the OpenAI API.
    """

    def __init__(self, model="gpt-3.5-turbo"):
        """
        Initialize the OpenAI chat agent.
        
        Args:
            model (str, optional): The OpenAI model to use. Defaults to "gpt-3.5-turbo".
        """
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key is required. Provide it as a parameter or set the OPENAI_API_KEY environment variable.")

        self.client = OpenAI(api_key=self.api_key)
        self.model = model

    def send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Process a message and return a response using the OpenAI API.
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": message.system_prompt},
                    {"role": "user", "content": message.user_prompt}
                ]
            )

            assistant_message = response.choices[0].message.content
            return ChatAgentMessageEgressDTO(message=assistant_message)

        except Exception as e:
            # In a production environment, you might want to handle different types of exceptions differently
            # For now, we'll just return the error message
            print(f"Error calling OpenAI API: {str(e)}")
            return ChatAgentMessageEgressDTO(message=error_message, is_error=True)
