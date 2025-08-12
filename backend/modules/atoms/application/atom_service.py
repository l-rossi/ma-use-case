from lxml import etree

from modules.atoms.application.atom_util import create_wildcard_predicates, insert_atom_spans, find_atom_spans
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
from modules.reasoning.application.prolog_reasoner import PrologReasoner
from modules.reasoning.domain.prompt_service import PromptService
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService


class AtomService:
    def __init__(self, regulation_fragment_service: RegulationFragmentService, atom_repository: AtomRepository,
                 chat_agent: LLMAdapter, prolog_reasoner: PrologReasoner, prompt_service: PromptService):
        self._atom_repository = atom_repository
        self._regulation_fragment_service = regulation_fragment_service
        self._chat_agent = chat_agent
        self._prolog_reasoner = prolog_reasoner
        self._prompt_service = prompt_service

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
            ) for atom in self._atom_repository.find_by_regulation_fragment_id(regulation_fragment_id)
        ]

    def delete_atoms_for_regulation_fragment(self, regulation_fragment_id: int) -> int:
        """
        Delete all atoms for a specific regulation fragment.
        Returns the number of atoms deleted.
        """
        return self._atom_repository.delete_by_regulation_fragment_id(regulation_fragment_id)

    def delete_atom_by_id(self, atom_id: int) -> bool:
        """
        Delete an atom by its ID.
        Returns True if the atom was deleted, False if it wasn't found.
        """
        return self._atom_repository.delete_by_id(atom_id)

    def create_atom(self, create_atom_dto: CreateAtomDTO) -> AtomDTO:
        """
        Create a new atom with the provided data.
        Returns the created atom as an AtomDTO.
        """
        created_atom = self._atom_repository.save(create_atom_dto)

        # Convert to DTO
        return AtomDTO(
            id=created_atom.id,
            regulation_fragment_id=created_atom.regulation_fragment_id,
            predicate=created_atom.predicate,
            description=created_atom.description,
            is_negated=created_atom.is_negated,
            is_fact=created_atom.is_fact,
            spans=[],  # New atoms don't have spans initially
        )

    def update_atom(self, atom_id: int, update_atom_dto: UpdateAtomDTO) -> AtomDTO:
        """
        Update an atom with the provided data.
        Returns the updated atom as an AtomDTO.

        Validates that the predicate is a valid Prolog predicate by replacing variables with wildcards
        and checking if it can be executed without errors.
        """
        if update_atom_dto.predicate is not None:
            wildcard_predicate, _ = create_wildcard_predicates(update_atom_dto.predicate)
            status, answers = self._prolog_reasoner.execute_prolog(f"{wildcard_predicate}.", wildcard_predicate)

            # Check if the response is an error
            if status == "error":
                error_message = answers[0].message if answers and hasattr(answers[0],
                                                                          'message') else "Invalid Prolog predicate"
                raise ValueError(f"Invalid Prolog predicate: {error_message}")

        updated_atom = self._atom_repository.update(atom_id, update_atom_dto)

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

        fragment = self._regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not fragment:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        atoms = self.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if not atoms:
            raise ValueError(f"No atoms found for regulation fragment {regulation_fragment_id}.")

        regeneration_request = self._prompt_service.get(
            fragment.formalism
        ).atom_regeneration_prompt(
            regulation_content=fragment.content,
            atoms=atoms,
            feedback=regenerate_data.feedback
        )

        response = self._chat_agent.send_message(
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
        regulation = self._regulation_fragment_service.find_by_id(regulation_fragment_id)
        if not regulation:
            raise ValueError(f"Regulation fragment with ID {regulation_fragment_id} not found.")

        existing_atoms = self.get_atoms_for_regulation_fragment(regulation_fragment_id)
        if existing_atoms:
            print(f"Atoms already exist for regulation fragment {regulation_fragment_id}. Skipping generation.")
            return

        print(f"Generating atoms for regulation fragment {regulation_fragment_id}...")

        input_message = self._prompt_service.get(regulation.formalism).atom_extraction_prompt(
            regulation.content,
        )

        returned_message = self._chat_agent.send_message(
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
            persisted_atom = self._atom_repository.save(
                CreateAtomDTO(
                    regulation_fragment_id=regulation_fragment_id,
                    predicate=atom.predicate,
                    description=atom.description,
                    is_negated=False,
                    is_fact=atom.is_fact
                )
            )
            local_id_to_global_id[atom.id] = persisted_atom.id

        for atom_span in find_atom_spans(parsed_result.annotated):
            self._atom_repository.save_span(
                CreateAtomSpanDTO(
                    atom_id=local_id_to_global_id[atom_span.atom_id],
                    start=atom_span.start,
                    end=atom_span.end
                )
            )
