import re
from typing import Generator

from lxml import etree

from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.atoms.application.dto.atom_extraction_result_dto import AtomExtractionResultDTO, ExtractedAtomDTO
from modules.atoms.application.dto.atom_span_dto import AtomSpanDTO
from modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from modules.atoms.application.dto.create_atom_span_dto import CreateAtomSpanDTO
from modules.atoms.application.dto.regenerate_atoms_dto import RegenerateAtomsDTO
from modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO
from modules.atoms.infra.atom_repository import AtomRepository
from modules.models.application.dto.chat_agent_message_ingress_dto import ChatAgentMessageIngressDTO
from modules.models.application.llm_adapter import LLMAdapter
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService


class AtomService:
    def __init__(self, regulation_fragment_service: RegulationFragmentService, atom_repository: AtomRepository,
                 chat_agent: LLMAdapter):
        self.atom_repository = atom_repository
        self.regulation_fragment_service = regulation_fragment_service
        self.chat_agent = chat_agent

        # TODO probably should make this configurable
        with open("./prompts/atom_extraction/prolog_1.txt", "r") as file:
            self.generation_prompt = file.read()

        with open("./prompts/atom_regeneration/prolog_1.txt", "r") as file:
            self.regeneration_prompt = file.read()

    def get_atoms_for_regulation_fragment(self, regulation_fragment_id: int):
        return [
            AtomDTO(
                id=atom.id,
                regulation_fragment_id=atom.regulation_fragment_id,
                predicate=atom.predicate,
                description=atom.description,
                is_negated=atom.is_negated,
                is_fact=atom.is_fact,
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

    def delete_atoms_for_regulation_fragment(self, regulation_fragment_id: int) -> int:
        """
        Delete all atoms for a specific regulation fragment.
        Returns the number of atoms deleted.
        """
        return self.atom_repository.delete_by_regulation_fragment_id(regulation_fragment_id)

    def delete_atom_by_id(self, atom_id: int) -> bool:
        """
        Delete an atom by its ID.
        Returns True if the atom was deleted, False if it wasn't found.
        """
        return self.atom_repository.delete_by_id(atom_id)

    def create_atom(self, create_atom_dto: CreateAtomDTO) -> AtomDTO:
        """
        Create a new atom with the provided data.
        Returns the created atom as an AtomDTO.
        """
        created_atom = self.atom_repository.save(create_atom_dto)

        # Convert to DTO
        return AtomDTO(
            id=created_atom.id,
            regulation_fragment_id=created_atom.regulation_fragment_id,
            predicate=created_atom.predicate,
            description=created_atom.description,
            is_negated=created_atom.is_negated,
            is_fact=created_atom.is_fact,
            spans=[], # New atoms don't have spans initially
        )

    def update_atom(self, update_atom_dto: UpdateAtomDTO) -> AtomDTO:
        """
        Update an atom with the provided data.
        Returns the updated atom as an AtomDTO.
        """
        updated_atom = self.atom_repository.update(update_atom_dto)

        return AtomDTO(
            id=updated_atom.id,
            regulation_fragment_id=updated_atom.regulation_fragment_id,
            predicate=updated_atom.predicate,
            description=updated_atom.description,
            is_negated=updated_atom.is_negated,
            is_fact=updated_atom.is_fact,
            spans=[
                AtomSpanDTO(
                    id=span.id,
                    atom_id=span.atom_id,
                    start=span.start,
                    end=span.end
                ) for span in updated_atom.spans
            ],
        )

    def regenerate_atoms_for_regulation_fragment(self, regulation_fragment_id: int,
                                                 regenerate_data: RegenerateAtomsDTO = None):
        """
        Regenerate atoms for a specific regulation fragment.
        This method deletes existing atoms and generates new ones.

        Args:
            regulation_fragment_id: The ID of the regulation fragment
            regenerate_data: Optional feedback data for regeneration
        """
        print(f"Regenerating atoms for regulation fragment {regulation_fragment_id}...")

        fragment = self.regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not fragment:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        atoms = self.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment {regulation_fragment_id}.")

        # I am guessing lower numbers are better for LLM performance, so we normalize IDs to start from 1 to reduce confusion.
        db_id_to_normalized_id = {atom.id: idx for idx, atom in enumerate(atoms, start=1)}

        previous_result = AtomExtractionResultDTO(
            annotated_raw=etree.fromstring(f"""<annotated>{_insert_atom_spans(
                fragment.content,
                [AtomSpanDTO(
                    id=span.id,
                    atom_id=db_id_to_normalized_id[span.atom_id],
                    start=span.start,
                    end=span.end
                ) for atom in atoms for span in atom.spans],
            )}</annotated>"""),
            atoms=[
                ExtractedAtomDTO(
                    # Use normalized IDs for atoms
                    id=db_id_to_normalized_id[atom.id],
                    predicate=atom.predicate,
                    description=atom.description,
                ) for atom in atoms
            ]
        ).to_xml().decode('utf-8')

        regeneration_request = self.regeneration_prompt.format(
            fragment.content,  # Original Statement
            previous_result,  # Previous extraction result
            regenerate_data.feedback  # Feedback for regeneration
        )

        response = self.chat_agent.send_message(
            ChatAgentMessageIngressDTO(
                user_prompt=regeneration_request,
                regulation_fragment_id=regulation_fragment_id,
            )
        )
        if response.is_error:
            raise ValueError(f"Error regenerating atoms: {response.message}")

        regenerated_result = AtomExtractionResultDTO.from_xml(response.message)
        self.delete_atoms_for_regulation_fragment(regulation_fragment_id)
        self._save_extracted_atoms(regenerated_result, regulation_fragment_id)

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

        input_message = self.generation_prompt.format(
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

        parsed_result = AtomExtractionResultDTO.from_xml(returned_message.message)
        self._save_extracted_atoms(parsed_result, regulation_fragment_id)

    def _save_extracted_atoms(self, parsed_result: AtomExtractionResultDTO, regulation_fragment_id: int):
        local_id_to_global_id = dict()

        # TODO error handling and retry logic.
        for atom in parsed_result.atoms:
            persisted_atom = self.atom_repository.save(
                CreateAtomDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    predicate=atom.predicate,
                    description=atom.description,
                    is_negated=False,
                    is_fact=atom.is_fact
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


def _insert_atom_spans(text: str, atom_spans: list[AtomSpanDTO]) -> str:
    """
    Insert atom spans into the text at the specified positions.
    This function assumes that the atom spans are sorted by their start position.
    """
    print("insert_atom_spans called with text:", text)
    output_text = []
    atom_spans.sort(key=lambda x: x.start)

    last_end = 0
    for span in atom_spans:
        output_text.append(text[last_end:span.start])
        output_text.append(f'<atom id="{span.atom_id}">{text[span.start:span.end]}</atom>')
        last_end = span.end
    output_text.append(text[last_end:])
    print(output_text)
    return ''.join(output_text)


def _find_atom_spans(text: str) -> Generator[CreateAtomSpanDTO, None]:
    pattern = r'<atom id="(\d+)">(.*?)<\/atom>'
    virtual_character_offset = 0

    for match in re.finditer(pattern, text, re.DOTALL):
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
