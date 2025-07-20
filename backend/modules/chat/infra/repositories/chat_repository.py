from typing import List
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from modules.chat.domain.agent import Agent
from db_models import ChatMessage


class ChatRepository:
    """
    Repository for managing chat messages in the database.
    Provides methods for saving and retrieving chat messages.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self,
             agent: Agent,
             regulation_fragment_id: int,
             chat_data: CreateChatMessageDTO) -> ChatMessage:
        """
        Save a chat message to the database.
        """
        chat_message = ChatMessage(
            regulation_fragment_id=regulation_fragment_id,
            content=chat_data.content,
            agent=agent
        )

        self.db.session.add(chat_message)
        self.db.session.commit()

        return chat_message

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int) -> List[ChatMessage]:
        """
        Retrieve all chat messages for a specific regulation fragment, ordered by creation date.
        """
        return ChatMessage.query.filter_by(regulation_fragment_id=regulation_fragment_id).order_by(
            desc(ChatMessage.created_at)).all()
