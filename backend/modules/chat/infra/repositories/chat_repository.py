from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

from backend.models import ChatMessage
from backend.modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from backend.modules.chat.domain.agent import Agent


class ChatRepository:
    """
    Repository for managing chat messages in the database.
    Provides methods for saving and retrieving chat messages.
    """
    from backend.models import ChatMessage

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self,
             agent: Agent,
             regulation_fragment_id: int,
             chat_data: CreateChatMessageDTO) -> None:
        """
        Save a chat message to the database.
        """
        from backend.models import ChatMessage
        chat_message = ChatMessage(
            regulation_fragment_id=regulation_fragment_id,
            content=chat_data.content,
            agent=agent
        )

        self.db.session.add(chat_message)
        self.db.session.commit()

    # TODO idk how to get the correct type here
    def find_by_regulation_fragment_id(self, regulation_fragment_id) -> list["ChatMessage"]:
        """
        Retrieve all chat messages for a specific regulation fragment, ordered by creation date.
        """
        return ChatMessage.query.where(regulation_fragment_id=regulation_fragment_id).order_by(
            desc(ChatMessage.created_at)).all()
