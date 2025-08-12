from typing import Optional

from db_models import RegulationFragment
from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import \
    CreateRegulationFragmentDTO
from modules.regulation_fragment.application.dto.regulation_fragment_dto import RegulationFragmentDTO
from modules.regulation_fragment.infra.regulation_fragment_repository import RegulationFragmentRepository


def _dto_from_db(fragment: RegulationFragment) -> RegulationFragmentDTO:
    """
    Convert a domain model to a DTO.
    """
    return RegulationFragmentDTO(
        id=fragment.id,
        title=fragment.title,
        content=fragment.content,
        created_at=fragment.created_at,
        source=fragment.source,
        llm_identifier=fragment.llm_identifier.value,
        formalism=fragment.formalism.value,
        used_tokens_in=fragment.used_tokens_in,
        used_tokens_out=fragment.used_tokens_out
    )


class RegulationFragmentService:
    def __init__(self, regulation_fragment_repository: RegulationFragmentRepository):
        self.regulation_fragment_repository = regulation_fragment_repository

    def save(self, fragment_data: CreateRegulationFragmentDTO) -> RegulationFragmentDTO:
        """
        Create a new regulation fragment.
        """
        created_fragment = self.regulation_fragment_repository.save(fragment_data)

        return _dto_from_db(created_fragment)

    def find_all(self) -> list[RegulationFragmentDTO]:
        """
        Retrieve all regulation fragments.
        """
        fragments = self.regulation_fragment_repository.find_all()

        return [_dto_from_db(fragment) for fragment in fragments]

    def find_by_id(self, fragment_id: int) -> Optional[RegulationFragmentDTO]:
        """
        Retrieve a regulation fragment by its ID.
        """
        fragment = self.regulation_fragment_repository.find_by_id(fragment_id)

        if not fragment:
            return None

        return _dto_from_db(fragment)

    def delete_by_id(self, fragment_id: int) -> bool:
        """
        Delete a regulation fragment by its ID.
        Returns True if the fragment was deleted, False if it wasn't found.
        """
        return self.regulation_fragment_repository.delete_by_id(fragment_id)

    def increment_tokens(self, fragment_id: int, delta_in: int, delta_out: int) -> Optional[RegulationFragmentDTO]:
        """
        Increment the token counts for a regulation fragment.

        Args:
            fragment_id: The ID of the regulation fragment
            delta_in: The number of tokens to add to used_tokens_in
            delta_out: The number of tokens to add to used_tokens_out

        Returns:
            The updated regulation fragment DTO, or None if it wasn't found
        """
        fragment = self.regulation_fragment_repository.increment_tokens(fragment_id, delta_in, delta_out)

        if not fragment:
            return None

        return _dto_from_db(fragment)
