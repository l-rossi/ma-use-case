"""
Leveraging Legal Information Representation for Business Process Compliance
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
"""

from typing import Optional, List, Literal

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

from db_models import AgenticLog
from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO


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
            user_prompt=log_data.user_prompt,
            system_prompt=log_data.system_prompt,
            message_source=log_data.message_source,
            regulation_fragment_id=log_data.regulation_fragment_id,
            is_error=log_data.is_error
        )

        self.db.session.add(agentic_log)
        self.db.session.commit()

        return agentic_log

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int, cursor: Optional[int] = None,
                                       limit: Optional[int] = None, order_date: Literal["asc", "desc"] = "asc") -> List[
        AgenticLog]:
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

        if cursor is not None:
            cursor_log = AgenticLog.query.get(cursor)
            if cursor_log:
                if order_date == "asc":
                    query = query.filter(AgenticLog.created_at > cursor_log.created_at)
                else:
                    query = query.filter(AgenticLog.created_at < cursor_log.created_at)

        query = query.order_by(
            AgenticLog.created_at.asc() if order_date == "asc" else
            AgenticLog.created_at.desc())

        if limit is not None:
            query = query.limit(limit)

        return query.all()
