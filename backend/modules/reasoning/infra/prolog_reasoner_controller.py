from flask import Blueprint, request

from di_container import container
from modules.reasoning.application.dto.prolog_query_dto import PrologQueryDTO
from modules.reasoning.application.dto.prolog_result_dto import PrologHttpResponseDTO

prolog_reasoner_controller = Blueprint('prolog_reasoner', __name__)


@prolog_reasoner_controller.post('/regulation-fragments/<regulation_fragment_id>/run-example')
def reason_with_examples(regulation_fragment_id):
    """
    Execute a Prolog query with user-provided facts for a specific regulation fragment.
    """
    request_data = PrologQueryDTO(**request.get_json())

    status, answers = container.prolog_reasoning_service().run_example(
        regulation_fragment_id=regulation_fragment_id,
        facts=request_data.facts,
    )

    return PrologHttpResponseDTO(
        status=status, answers=answers
    ).model_dump(), 200
