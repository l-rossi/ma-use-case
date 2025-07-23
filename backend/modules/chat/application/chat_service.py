from typing import List

from modules.atoms.application.atom_service import AtomService
from modules.chat.application.dto.chat_message_dto import ChatMessageDTO
from modules.chat.application.dto.context_message_dto import ContextMessageDTO
from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from modules.chat.domain.agent import Agent
from modules.chat.domain.context_message_type import ContextMessageType
from modules.chat.infra.repositories.chat_repository import ChatRepository
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.llm_adapter import LLMAdapter
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from modules.rules.application.rule_service import RuleService


class ChatService:
    def __init__(self,
                 atom_service: AtomService,
                 regulation_fragment_service: RegulationFragmentService,
                 chat_repository: ChatRepository,
                 chat_agent: LLMAdapter,
                 rule_service: RuleService):
        self.chat_repository = chat_repository
        self.chat_agent = chat_agent
        self.atom_service = atom_service
        self.regulation_fragment_service = regulation_fragment_service
        self.rules_service = rule_service

        with open("./prompts/chat/prolog_1.txt", "r") as file:
            self.system_prompt = file.read()

    def get_by_regulation_id(self, regulation_id: int) -> List[ChatMessageDTO]:
        """
        Retrieve chat messages by regulation ID.
        :param regulation_id: The ID of the regulation fragment to retrieve messages for.
        :return:
        """
        return [
            ChatMessageDTO(
                id=message.id,
                content=message.content,
                created_at=message.created_at,
                agent=message.agent
            ) for message in self.chat_repository.find_by_regulation_fragment_id(regulation_id)
        ]

    def send_chat_message(self, regulation_id: int, dto: CreateChatMessageDTO) -> ChatMessageDTO:
        """
        Send a message to the chat agent and return the response.
        """
        print("Sending message for regulation ID:", regulation_id)

        history = self.get_by_regulation_id(regulation_id)

        atoms = self.atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id=regulation_id)
        rules = self.rules_service.get_rules_by_regulation_id(regulation_fragment_id=regulation_id)

        regulation = self.regulation_fragment_service.find_by_id(regulation_id)

        formatted_atoms = "\n".join(
            f"{atom.predicate}: {atom.description}" for atom in atoms
        )
        formatted_rules = "\n".join(
            f"{rule.definition}: {rule.description}" for rule in rules
        )

        system_prompt = self.system_prompt.format(
            regulation.content,
            formatted_atoms,
            formatted_rules,
        )

        context_messages = [
            ContextMessageDTO(
                content=h.content,
                type=_context_message_type_from_agent(h.agent)
            ) for h in history
        ].reverse()

        user_message = ChatAgentMessageIngressDTO(
            regulation_fragment_id=regulation_id,
            user_prompt=dto.content,
            system_prompt=system_prompt,
        )

        saved_user_message = self.chat_repository.save(
            agent=Agent.USER,
            regulation_fragment_id=regulation_id,
            chat_data=CreateChatMessageDTO(content=dto.content)
        )

        response = self.chat_agent.send_message(
            message=user_message,
            context_messages=context_messages,
        )

        self.chat_repository.save(
            agent=Agent.AI,
            regulation_fragment_id=regulation_id,
            chat_data=CreateChatMessageDTO(content=response.message)
        )

        return ChatMessageDTO(
            id=saved_user_message.id,
            content=saved_user_message.content,
            created_at=saved_user_message.created_at,
            agent=Agent.AI
        )


def _context_message_type_from_agent(agent: Agent) -> ContextMessageType:
    """
    Convert an Agent to a context message type string.
    """
    if agent == Agent.USER:
        return ContextMessageType.USER
    elif agent == Agent.AI:
        return ContextMessageType.AGENT
    else:
        raise ValueError(f"Unknown agent type: {agent}")
