from flask import Blueprint, jsonify

from di_container import container

explanation_controller = Blueprint('explanation', __name__)


@explanation_controller.post('/regulation-fragments/<fragment_id>/generate-examples')
def generate_examples_for_regulation_fragment(fragment_id):
    """
    Generate examples for a regulation fragment.

    :param fragment_id: The ID of the regulation fragment.
    :return: The generated examples.
    """
    explanation_service = container.explanation_service()
    examples = explanation_service.generate_examples_for_regulation_fragment(int(fragment_id))
    return examples.model_dump()