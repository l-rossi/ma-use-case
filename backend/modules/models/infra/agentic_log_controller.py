from flask import Blueprint, request, jsonify
from di_container import container
from modules.models.application.dto.create_agentic_log_dto import CreateAgenticLogDTO

agentic_log_controller = Blueprint('agentic_log', __name__)


@agentic_log_controller.get('/agentic-logs')
def get_all():
    return [log.model_dump() for log in container.agentic_log_service().find_all()]


@agentic_log_controller.get('/agentic-logs/<log_id>')
def get_by_id(log_id: str):
    log = container.agentic_log_service().find_by_id(int(log_id))
    if log:
        return log.model_dump()
    else:
        return jsonify({"error": "Agentic log not found"}), 404


@agentic_log_controller.get('/regulation-fragments/<fragment_id>/agentic-logs')
def get_by_regulation_fragment_id(fragment_id: str):
    # Extract cursor and limit from query parameters
    cursor = request.args.get('cursor')
    limit = request.args.get('limit')

    # Convert parameters to appropriate types if they exist
    cursor_id = int(cursor) if cursor is not None else None
    limit_val = int(limit) if limit is not None else None

    return [log.model_dump() for log in container.agentic_log_service().find_by_regulation_fragment_id(
        regulation_fragment_id=int(fragment_id),
        cursor=cursor_id,
        limit=limit_val
    )]


@agentic_log_controller.post('/agentic-logs')
def create():
    log_data = CreateAgenticLogDTO(**request.get_json())
    log = container.agentic_log_service().create(log_data)
    return log.model_dump(), 201


@agentic_log_controller.delete('/agentic-logs/<log_id>')
def delete_by_id(log_id: str):
    result = container.agentic_log_service().delete_by_id(int(log_id))
    if result:
        return '', 204
    else:
        return jsonify({"error": "Agentic log not found"}), 404
