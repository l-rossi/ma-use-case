from typing import Optional, List

from modules.models.application.dto.agentic_log_dto import AgenticLogDTO
from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO
from modules.models.infra.agentic_log_repository import AgenticLogRepository


class AgenticLogService:
    def __init__(self, agentic_log_repository: AgenticLogRepository):
        self.agentic_log_repository = agentic_log_repository

    def create(self, log_data: CreateAgenticLogDTO) -> AgenticLogDTO:
        """
        Create a new agentic log.
        """
        created_log = self.agentic_log_repository.save(log_data)

        return AgenticLogDTO(
            id=created_log.id,
            log_entry=created_log.log_entry,
            message_source=created_log.message_source,
            regulation_fragment_id=created_log.regulation_fragment_id,
            created_at=created_log.created_at
        )

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int, cursor: Optional[int] = None,
                                       limit: Optional[int] = None) -> List[AgenticLogDTO]:
        """
        Retrieve agentic logs for a specific regulation fragment with optional pagination.

        Args:
            regulation_fragment_id: ID of the regulation fragment
            cursor: Optional ID to start retrieving logs after (for pagination)
            limit: Optional maximum number of logs to retrieve

        Returns:
            List of agentic logs
        """
        logs = self.agentic_log_repository.find_by_regulation_fragment_id(
            regulation_fragment_id=regulation_fragment_id,
            cursor=cursor,
            limit=limit
        )

        return [
            AgenticLogDTO(
                id=log.id,
                log_entry=log.log_entry,
                message_source=log.message_source,
                regulation_fragment_id=log.regulation_fragment_id,
                created_at=log.created_at
            )
            for log in logs
        ]
