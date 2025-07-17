import os
from typing import override

from openai import OpenAI

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
                "OpenAI API key is required. Provide it as a parameter or set the OPENAI_API_KEY environment variable.")

        self.client = OpenAI(api_key=self.api_key)
        self.model = model

    def _send_message(self, message: ChatAgentMessageIngressDTO) -> ChatAgentMessageEgressDTO:
        """
        Process a message and return a response using the OpenAI API.
        """

        return ChatAgentMessageEgressDTO(
            message="""
<result>
<annotated>
If a <atom id="1">Consumer</atom> tells the <atom id="2">Supplier</atom> that they are <atom id="3">dissatisfied</atom> with the <atom id="4">timeframes</atom> that apply to the <atom id="5">management</atom> of a <atom id="6">Complaint</atom> or <atom id="7">seek</atom> to have a <atom id="8">Complaint</atom> treated as an <atom id="9">Urgent Complaint</atom>, the <atom id="10">Supplier</atom> must <atom id="11">tell</atom> the <atom id="12">Consumer</atom> about the <atom id="13">Supplier’s internal prioritisation</atom> and <atom id="14">internal escalation processes</atom>.
</annotated>
<atoms>
<atom id="1">consumer(X)</atom>
<atom id="2">supplier(Y)</atom>
<atom id="3">dissatisfied(X, Aspect)</atom>
<atom id="4">timeframe(Complaint, Time)</atom>
<atom id="5">management(Complaint)</atom>
<atom id="6">complaint(C)</atom>
<atom id="7">seeks(X, urgent_treatment(C))</atom>
<atom id="8">complaint(C)</atom>
<atom id="9">urgent_complaint(C)</atom>
<atom id="10">supplier(Y)</atom>
<atom id="11">informs(Y, X, Info)</atom>
<atom id="12">consumer(X)</atom>
<atom id="13">prioritisation_process(Y)</atom>
<atom id="14">escalation_process(Y)</atom>
</atoms>
</result>
""",
            is_error=False,
        )

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
