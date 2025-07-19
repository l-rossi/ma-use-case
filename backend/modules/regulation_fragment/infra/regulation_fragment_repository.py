from typing import Optional, List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import \
    CreateRegulationFragmentDTO
from db_models import RegulationFragment


class RegulationFragmentRepository:
    """
    Repository for managing regulation fragments in the database.
    Provides methods for creating, finding all, and finding by ID.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, fragment_data: CreateRegulationFragmentDTO) -> RegulationFragment:
        """
        Create a new regulation fragment in the database.
        """
        regulation_fragment = RegulationFragment(
            title=fragment_data.title,
            content=fragment_data.content,
            llm_identifier=fragment_data.llm_identifier,
        )

        self.db.session.add(regulation_fragment)
        self.db.session.commit()

        return regulation_fragment

    def find_all(self) -> List[RegulationFragment]:
        """
        Retrieve all regulation fragments, ordered by creation date.
        """
        return RegulationFragment.query.order_by(desc(RegulationFragment.created_at)).all()

    def find_by_id(self, fragment_id: int) -> Optional[RegulationFragment]:
        """
        Retrieve a regulation fragment by its ID.
        """
        return RegulationFragment.query.get(fragment_id)

    def delete_by_id(self, fragment_id: int) -> bool:
        """
        Delete a regulation fragment by its ID.
        Returns True if the fragment was deleted, False if it wasn't found.
        """
        fragment = RegulationFragment.query.get(fragment_id)

        if not fragment:
            return False

        self.db.session.delete(fragment)
        self.db.session.commit()

        return True
