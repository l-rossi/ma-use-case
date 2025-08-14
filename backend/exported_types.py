from modules.explanations.application.dto.example_generation_dto import ExamplesDTO
from modules.models.application.dto.agentic_log_dto import AgenticLogDTO
from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO
from modules.chat.application.dto.chat_message_dto import ChatMessageDTO
from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import CreateRegulationFragmentDTO
from modules.regulation_fragment.application.dto.regulation_fragment_dto import RegulationFragmentDTO
from modules.regulation_fragment.application.dto.price_dto import PriceDTO
from modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO
from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.atoms.application.dto.atom_span_dto import AtomSpanDTO
from modules.atoms.application.dto.regenerate_atoms_dto import RegenerateAtomsDTO
from modules.rules.application.dto.regenerate_rules_dto import RegenerateRulesDTO
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.application.dto.update_rule_dto import UpdateRuleDTO
from modules.reasoning.application.dto.prolog_result_dto import PrologResultDTO, PrologAnswerDTO, PrologHttpResponseDTO
from modules.reasoning.application.dto.prolog_query_dto import PrologQueryDTO

# Stop PyCharm from optimizing imports :))))))
_ = [
    AgenticLogDTO,
    CreateChatMessageDTO,
    ChatMessageDTO,
    CreateRegulationFragmentDTO,
    RegulationFragmentDTO,
    PriceDTO,
    CreateAtomDTO,
    UpdateAtomDTO,
    AtomDTO,
    AtomSpanDTO,
    RegenerateAtomsDTO,
    RuleDTO,
    CreateRuleDTO,
    UpdateRuleDTO,
    RegenerateRulesDTO,
    PrologResultDTO,
    PrologAnswerDTO,
    PrologQueryDTO,
    PrologHttpResponseDTO,
    ExamplesDTO,
]
