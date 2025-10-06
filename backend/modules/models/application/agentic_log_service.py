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

from modules.models.application.dto.agentic_log_dto import AgenticLogDTO
from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO
from modules.models.infra.agentic_log_repository import AgenticLogRepository


class AgenticLogService:
    def __init__(self, agentic_log_repository: AgenticLogRepository):
        self._agentic_log_repository = agentic_log_repository

    def create(self, log_data: CreateAgenticLogDTO) -> AgenticLogDTO:
        """
        Create a new agentic log.
        """
        created_log = self._agentic_log_repository.save(log_data)

        return AgenticLogDTO(
            id=created_log.id,
            user_prompt=created_log.user_prompt,
            system_prompt=created_log.system_prompt,
            message_source=created_log.message_source,
            regulation_fragment_id=created_log.regulation_fragment_id,
            created_at=created_log.created_at,
            is_error=created_log.is_error
        )

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int, cursor: Optional[int] = None,
                                       limit: Optional[int] = None, order_date: Literal["asc", "desc"] = "asc") -> List[
        AgenticLogDTO]:
        """
        Retrieve agentic logs for a specific regulation fragment with optional pagination.

        Args:
            regulation_fragment_id: ID of the regulation fragment
            cursor: Optional ID to start retrieving logs after (for pagination)
            limit: Optional maximum number of logs to retrieve
            order_date: Order of logs by creation date, either "asc" or "desc"

        Returns:
            List of agentic logs
        """
        logs = self._agentic_log_repository.find_by_regulation_fragment_id(
            regulation_fragment_id=regulation_fragment_id,
            cursor=cursor,
            limit=limit,
            order_date=order_date
        )

        return [
            AgenticLogDTO(
                id=log.id,
                user_prompt=log.user_prompt,
                system_prompt=log.system_prompt,
                message_source=log.message_source,
                regulation_fragment_id=log.regulation_fragment_id,
                created_at=log.created_at,
                is_error=log.is_error
            )
            for log in logs
        ]
