from typing import Optional

from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import \
    CreateRegulationFragmentDTO
from modules.regulation_fragment.application.dto.regulation_fragment_dto import RegulationFragmentDTO
from modules.regulation_fragment.infra.regulation_fragment_repository import RegulationFragmentRepository


class RegulationFragmentService:
    def __init__(self, regulation_fragment_repository: RegulationFragmentRepository):
        self.regulation_fragment_repository = regulation_fragment_repository

    def save(self, fragment_data: CreateRegulationFragmentDTO) -> RegulationFragmentDTO:
        """
        Create a new regulation fragment.
        """
        created_fragment = self.regulation_fragment_repository.save(fragment_data)

        return RegulationFragmentDTO(
            id=created_fragment.id,
            title=created_fragment.title,
            content=created_fragment.content,
            created_at=created_fragment.created_at
        )

    def find_all(self) -> list[RegulationFragmentDTO]:
        """
        Retrieve all regulation fragments.
        """
        fragments = self.regulation_fragment_repository.find_all()

        return [
            RegulationFragmentDTO(
                id=fragment.id,
                title=fragment.title,
                content=fragment.content,
                created_at=fragment.created_at
            )
            for fragment in fragments
        ]

    def find_by_id(self, fragment_id: int) -> Optional[RegulationFragmentDTO]:
        """
        Retrieve a regulation fragment by its ID.
        """
        fragment = self.regulation_fragment_repository.find_by_id(fragment_id)

        if not fragment:
            return None

        return RegulationFragmentDTO(
            id=fragment.id,
            title=fragment.title,
            content=fragment.content,
            created_at=fragment.created_at
        )

    def delete_by_id(self, fragment_id: int) -> bool:
        """
        Delete a regulation fragment by its ID.
        Returns True if the fragment was deleted, False if it wasn't found.
        """
        return self.regulation_fragment_repository.delete_by_id(fragment_id)
