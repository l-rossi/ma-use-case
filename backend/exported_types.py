from .modules.models.application.dto.agentic_log_dto import AgenticLogDTO
from .modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from .modules.chat.application.dto.chat_message_dto import ChatMessageDTO
from .modules.regulation_fragment.application.dto.create_regulation_fragment_dto import CreateRegulationFragmentDTO
from .modules.regulation_fragment.application.dto.regulation_fragment_dto import RegulationFragmentDTO
from .modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from .modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO
from .modules.atoms.application.dto.atom_dto import AtomDTO
from .modules.atoms.application.dto.atom_span_dto import AtomSpanDTO

# Stop PyCharm from optimizing imports :))))))
_ = [
    AgenticLogDTO,
    CreateChatMessageDTO,
    ChatMessageDTO,
    CreateRegulationFragmentDTO,
    RegulationFragmentDTO,
    CreateAtomDTO,
    UpdateAtomDTO,
    AtomDTO,
    AtomSpanDTO
]
