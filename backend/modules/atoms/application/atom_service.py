import re
from typing import Generator

from modules.atoms.application.dto import AtomExtractionResultDTO, CreateAtomDTO, AtomDTO, AtomSpanDTO
from modules.atoms.application.dto.create_atom_span_dto import CreateAtomSpanDTO
from modules.atoms.infra.atom_repository import AtomRepository
from modules.models.application.agentic_log_service import AgenticLogService
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.infra.services.i_chat_agent import IChatAgent
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService


class AtomService:
    def __init__(self, regulation_fragment_service: RegulationFragmentService, atom_repository: AtomRepository,
                 chat_agent: IChatAgent, agentic_log_service: AgenticLogService):
        self.atom_repository = atom_repository
        self.regulation_fragment_service = regulation_fragment_service
        self.chat_agent = chat_agent
        self.agentic_log_service = agentic_log_service

        # TODO probably should make this configurable
        with open("./prompts/atom_extraction/prolog_1.txt", "r") as file:
            self.prompt = file.read()

    def get_atoms_for_regulation_fragment(self, regulation_fragment_id: int):
        return [
            AtomDTO(
                id=atom.id,
                regulation_fragment_id=atom.regulation_fragment_id,
                predicate=atom.predicate,
                description=atom.description,
                is_negated=atom.is_negated,
                spans=[
                    AtomSpanDTO(
                        id=span.id,
                        atom_id=span.atom_id,
                        start=span.start,
                        end=span.end
                    ) for span in atom.spans
                ],
            ) for atom in self.atom_repository.find_by_regulation_fragment_id(regulation_fragment_id)
        ]

    def generate_atoms_for_regulation_fragment(self, regulation_fragment_id: int):
        """
        Generate atoms for a specific regulation fragment.
        This method should implement the logic to generate atoms based on the regulation fragment.
        """
        regulation = self.regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not regulation:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        existing_atoms = self.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if existing_atoms:
            print(f"Atoms already exist for regulation fragment {regulation_fragment_id}. Skipping generation.")
            return

        print(f"Generating atoms for regulation fragment {regulation_fragment_id}...")

        input_message = self.prompt.format(
            regulation.content,
        )

        returned_message = self.chat_agent.send_message(
            ChatAgentMessageIngressDTO(
                user_prompt=input_message,
                system_prompt='',
                regulation_fragment_id=regulation_fragment_id
            )
        )

        if returned_message.is_error:
            raise ValueError(f"Error generating atoms: {returned_message.message}")

        print("-" * 12)

        print(returned_message.message)

        print("-" * 12)

        parsed_result = AtomExtractionResultDTO.from_xml(returned_message.message)

        print(parsed_result)

        local_id_to_global_id = dict()

        # TODO error handling and retry logic.
        for atom in parsed_result.atoms.atom:
            persisted_atom = self.atom_repository.save(
                CreateAtomDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    predicate=atom.predicate,
                    description="TODO",
                    is_negated=False
                )
            )
            local_id_to_global_id[atom.id] = persisted_atom.id

        for atom_span in _find_atom_spans(parsed_result.annotated):
            self.atom_repository.save_span(
                CreateAtomSpanDTO(
                    atom_id=local_id_to_global_id[atom_span.atom_id],
                    start=atom_span.start,
                    end=atom_span.end
                )
            )


def _find_atom_spans(text: str) -> Generator[CreateAtomSpanDTO, None]:
    pattern = r'<atom id="(\d+)">(.*?)<\/atom>'

    virtual_character_offset = 0
    print(
        list(re.finditer(pattern, text, re.DOTALL))
    )

    for match in re.finditer(pattern, text, re.DOTALL):
        print(match)
        atom_id = int(match.group(1))

        match_start, match_end = match.span()
        content_start, content_end = match.span(2)

        content_len = content_end - content_start
        match_len = match_end - match_start

        yield CreateAtomSpanDTO(
            atom_id=atom_id,
            start=match_start - virtual_character_offset,
            end=match_start - virtual_character_offset + content_len,
        )

        virtual_character_offset += match_len - content_len
