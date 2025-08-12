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
            source=fragment_data.source,
            llm_identifier=fragment_data.llm_identifier,
            formalism=fragment_data.formalism,
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

    def increment_tokens(self, fragment_id: int, delta_in: int, delta_out: int) -> Optional[RegulationFragment]:
        """
        Increment the token counts for a regulation fragment.

        Args:
            fragment_id: The ID of the regulation fragment
            delta_in: The number of tokens to add to used_tokens_in
            delta_out: The number of tokens to add to used_tokens_out

        Returns:
            The updated regulation fragment, or None if it wasn't found
        """
        fragment = self.find_by_id(fragment_id)

        if not fragment:
            return None

        fragment.used_tokens_in += delta_in
        fragment.used_tokens_out += delta_out

        self.db.session.add(fragment)
        self.db.session.commit()

        return fragment
