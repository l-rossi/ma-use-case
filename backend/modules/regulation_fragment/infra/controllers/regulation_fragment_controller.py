from flask import Blueprint, request
from backend.di_container import container
from backend.modules.regulation_fragment.application.dto.create_regulation_fragment_dto import CreateRegulationFragmentDTO

regulation_fragment_controller = Blueprint('regulation_fragment', __name__)


@regulation_fragment_controller.get('/regulation-fragments')
def get_all():
    return container.regulation_fragment_service().findAll()


@regulation_fragment_controller.get('/regulation-fragments/<fragment_id>')
def get_by_id(fragment_id: str):
    return container.regulation_fragment_service().findById(int(fragment_id))


@regulation_fragment_controller.post('/regulation-fragments')
def create():
    fragment_data = CreateRegulationFragmentDTO(**request.get_json())
    return container.regulation_fragment_service().create(fragment_data), 201