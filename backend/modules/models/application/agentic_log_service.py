from typing import Optional, List, Literal

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
            user_prompt=created_log.user_prompt,
            system_prompt=created_log.system_prompt,
            message_source=created_log.message_source,
            regulation_fragment_id=created_log.regulation_fragment_id,
            created_at=created_log.created_at
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
        logs = self.agentic_log_repository.find_by_regulation_fragment_id(
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
                created_at=log.created_at
            )
            for log in logs
        ]
