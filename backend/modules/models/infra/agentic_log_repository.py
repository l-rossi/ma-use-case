from typing import Optional, List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO
from db_models import AgenticLog


class AgenticLogRepository:
    """
    Repository for managing agentic logs in the database.
    Provides methods for creating, finding all, finding by ID, and finding by regulation fragment ID.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, log_data: CreateAgenticLogDTO) -> AgenticLog:
        """
        Create a new agentic log in the database.
        """
        agentic_log = AgenticLog(
            log_entry=log_data.log_entry,
            message_source=log_data.message_source,
            regulation_fragment_id=log_data.regulation_fragment_id
        )

        self.db.session.add(agentic_log)
        self.db.session.commit()

        return agentic_log

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int, cursor: Optional[int] = None, limit: Optional[int] = None) -> List[AgenticLog]:
        """
        Retrieve agentic logs for a specific regulation fragment, ordered by creation date.

        Args:
            regulation_fragment_id: ID of the regulation fragment
            cursor: Optional ID to start retrieving logs after (for pagination)
            limit: Optional maximum number of logs to retrieve

        Returns:
            List of agentic logs
        """

        query = AgenticLog.query.filter_by(regulation_fragment_id=regulation_fragment_id)

        # If cursor is provided, get items after the cursor
        if cursor is not None:
            cursor_log = AgenticLog.query.get(cursor)
            if cursor_log:
                query = query.filter(AgenticLog.created_at < cursor_log.created_at)

        # Order by creation date (newest first)
        query = query.order_by(desc(AgenticLog.created_at))

        # Apply limit if provided
        if limit is not None:
            query = query.limit(limit)

        return query.all()
