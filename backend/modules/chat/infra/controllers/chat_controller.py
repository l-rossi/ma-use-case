from flask import Blueprint, request
from di_container import container
from modules.chat.application.dto.create_chat_message_dto import CreateChatMessageDTO

chat_controller = Blueprint('chat', __name__)


@chat_controller.get('/regulations/<regulation_id>/chat')
def get_by_regulation_id(regulation_id: str):
    return container.chat_service.get_by_regulation_id(regulation_id)


@chat_controller.post('/regulations/<regulation_id>/chat')
def create(regulation_id: str):
    chat_data = CreateChatMessageDTO(**request.get_json())
    return container.chat_service.handle_user_message(regulation_id, chat_data), 201
