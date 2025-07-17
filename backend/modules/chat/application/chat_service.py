from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from modules.chat.infra.repositories.chat_repository import ChatRepository
from modules.models.infra.services.i_chat_agent import IChatAgent





class ChatService():
    def __init__(self, chat_repository: ChatRepository, chat_agent: IChatAgent):
        self.chat_repository = chat_repository
        self.chat_agent = chat_agent

    def handle_user_message(self, regulation_id: str, chat_data: CreateChatMessageDTO) -> None:
        """
        Handle a user message by saving it to the repository.
        """
        print("Received chat data:", chat_data.content)

        self.chat_repository.save(chat_data)
