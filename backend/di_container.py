from dependency_injector import containers, providers

from db import create_db
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.llm_adapter import LLMAdapter
from modules.models.infra.agentic_log_repository import AgenticLogRepository
from modules.atoms.application.atom_service import AtomService
from modules.atoms.infra.atom_repository import AtomRepository
from modules.chat.application.chat_service import ChatService
from modules.chat.infra.repositories.chat_repository import ChatRepository
from modules.models.infra.services.openai_chat_agent import OpenAIChatAgent
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from modules.regulation_fragment.infra.regulation_fragment_repository import \
    RegulationFragmentRepository


class Container(containers.DeclarativeContainer):
    db = providers.Singleton(create_db)

    agentic_log_repository = providers.Singleton(AgenticLogRepository, db=db)
    agentic_log_service = providers.Singleton(
        AgenticLogService,
        agentic_log_repository=agentic_log_repository
    )

    regulation_fragment_repository = providers.Singleton(RegulationFragmentRepository, db=db)
    regulation_fragment_service = providers.Singleton(
        RegulationFragmentService,
        regulation_fragment_repository=regulation_fragment_repository
    )

    llm_adapter = providers.Singleton(
        LLMAdapter,
        agentic_log_service=agentic_log_service,
        regulation_fragment_service=regulation_fragment_service
    )

    chat_repository = providers.Singleton(ChatRepository, db=db)
    chat_service = providers.Singleton(
        ChatService,
        chat_repository=chat_repository,
        chat_agent=llm_adapter
    )

    atom_repository = providers.Singleton(AtomRepository, db=db)
    atom_service = providers.Singleton(
        AtomService,
        regulation_fragment_service=regulation_fragment_service,
        atom_repository=atom_repository,
        chat_agent=llm_adapter,
        agentic_log_service=agentic_log_service
    )


container = Container()
