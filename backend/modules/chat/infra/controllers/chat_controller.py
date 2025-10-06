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

from flask import Blueprint, request
from di_container import container
from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO

chat_controller = Blueprint('chat', __name__)


@chat_controller.get('/regulations/<regulation_id>/chat')
def get_by_regulation_id(regulation_id: str):
    return [m.model_dump() for m in container.chat_service().get_by_regulation_id(regulation_id)]


@chat_controller.post('/regulations/<regulation_id>/chat')
def create(regulation_id: str):
    chat_data = CreateChatMessageDTO(**request.get_json())
    return container.chat_service().send_chat_message(regulation_id, chat_data).model_dump(), 201
