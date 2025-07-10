from dependency_injector import containers, providers
from flask_sqlalchemy import SQLAlchemy

from backend.db import create_db
from backend.modules.chat.application.chat_service import ChatService
from backend.modules.chat.infra import OpenAIChatAgent
from backend.modules.chat.infra.repositories.chat_repository import ChatRepository
from backend.modules.chat.infra.services.i_chat_agent import IChatAgent
from backend.modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from backend.modules.regulation_fragment.infra.repositories.regulation_fragment_repository import \
    RegulationFragmentRepository


class Container(containers.DeclarativeContainer):
    db = providers.Singleton(create_db)

    chat_repository = providers.Singleton(ChatRepository, db=db)
    chat_agent = providers.Singleton(OpenAIChatAgent)
    chat_service = providers.Singleton(
        ChatService,
        chat_repository=chat_repository,
        chat_agent=chat_agent
    )

    regulation_fragment_repository = providers.Singleton(RegulationFragmentRepository, db=db)
    regulation_fragment_service = providers.Singleton(
        RegulationFragmentService,
        regulation_fragment_repository=regulation_fragment_repository
    )


container = Container()
