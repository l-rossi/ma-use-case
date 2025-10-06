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

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from modules.models.domain.message_source import MessageSource


class AgenticLogDTO(BaseModel):
    """
    Data Transfer Object for an agentic log.

    id: Unique identifier for the log
    user_prompt: The prompt issued by the human user
    system_prompt: Optional prompt issued from the application
    message_source: The source of the message (USER, SYSTEM, MODEL)
    regulation_fragment_id: ID of the regulation fragment this log is associated with
    created_at: When the log was created
    is_error: Whether this log entry represents an error message
    """
    id: int
    user_prompt: str
    system_prompt: Optional[str] = None
    message_source: MessageSource
    regulation_fragment_id: int
    created_at: datetime
    is_error: bool = False

    class Config:
        use_enum_values = True
        extra = "forbid"
