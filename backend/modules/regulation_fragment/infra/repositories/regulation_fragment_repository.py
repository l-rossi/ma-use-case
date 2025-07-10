from typing import Optional

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc


class RegulationFragmentRepository:
    """
    Repository for managing regulation fragments in the database.
    Provides methods for creating, finding all, and finding by ID.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def create(self, fragment_data) -> "RegulationFragment":
        """
        Create a new regulation fragment in the database.
        """
        from backend.models import RegulationFragment
        regulation_fragment = RegulationFragment(
            title=fragment_data.title,
            content=fragment_data.content
        )

        self.db.session.add(regulation_fragment)
        self.db.session.commit()

        return regulation_fragment

    def findAll(self) -> list["RegulationFragment"]:
        """
        Retrieve all regulation fragments, ordered by creation date.
        """
        from backend.models import RegulationFragment
        return RegulationFragment.query.order_by(desc(RegulationFragment.created_at)).all()

    def findById(self, fragment_id: int) -> Optional["RegulationFragment"]:
        """
        Retrieve a regulation fragment by its ID.
        """
        from backend.models import RegulationFragment
        return RegulationFragment.query.get(fragment_id)
