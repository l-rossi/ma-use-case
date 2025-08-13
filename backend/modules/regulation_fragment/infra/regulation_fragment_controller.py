from flask import Blueprint, request, jsonify
from di_container import container
from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import \
    CreateRegulationFragmentDTO

regulation_fragment_controller = Blueprint('regulation_fragment', __name__)


@regulation_fragment_controller.get('/regulation-fragments')
def get_all():
    return [fragment.model_dump() for fragment in container.regulation_fragment_service().find_all()]


@regulation_fragment_controller.get('/regulation-fragments/<fragment_id>')
def get_by_id(fragment_id: str):
    return container.regulation_fragment_service().find_by_id(int(fragment_id)).model_dump()


@regulation_fragment_controller.post('/regulation-fragments')
def create():
    fragment_data = CreateRegulationFragmentDTO(**request.get_json())
    fragment = container.regulation_fragment_service().save(fragment_data)
    return fragment.model_dump(), 201


@regulation_fragment_controller.delete('/regulation-fragments/<fragment_id>')
def delete_by_id(fragment_id: str):
    result = container.regulation_fragment_service().delete_by_id(int(fragment_id))
    if result:
        return '', 204
    else:
        return jsonify({"error": "Regulation fragment not found"}), 404


@regulation_fragment_controller.get('/regulation-fragments/<fragment_id>/cost')
def get_cost(fragment_id: str):
    price_dto = container.regulation_fragment_service().estimate_cost(int(fragment_id))
    if price_dto:
        return price_dto.model_dump()
    else:
        return jsonify({"error": "Regulation fragment not found"}), 404
