from flask import Blueprint, request

from di_container import container
from modules.reasoning.application.dto.prolog_query_dto import PrologQueryDTO

prolog_reasoner_controller = Blueprint('prolog_reasoner', __name__)

@prolog_reasoner_controller.post('/regulation-fragments/<regulation_fragment_id>/run-example')
def reason_with_examples(regulation_fragment_id):
    """
    Execute a Prolog query with user-provided facts for a specific regulation fragment.
    """
    print(f"Received request for regulation fragment ID: {regulation_fragment_id}")
    request_data = request.get_json()
    facts = request_data.get('facts', {})
    goal = request_data.get('goal')
    

    status, answers = container.prolog_reasoning_service().run_example(
        regulation_fragment_id=regulation_fragment_id,
        facts=facts,
        goal=goal
    )
    

    return {
        "status": status,
        "answers": [answer.model_dump() for answer in answers]
    }, 200