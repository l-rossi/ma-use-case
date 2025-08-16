from flask import Blueprint, jsonify, Response

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


@explanation_controller.get('/regulation-fragments/<fragment_id>/formalism')
def get_formalism_text(fragment_id):
    """
    Get the formalism text for a regulation fragment.

    :param fragment_id: The ID of the regulation fragment.
    :return: The formalism text.
    """
    explanation_service = container.explanation_service()
    formalism_text = explanation_service.get_formalism_text(int(fragment_id))
    return jsonify({"text": formalism_text})


@explanation_controller.get('/regulation-fragments/<fragment_id>/formalism/download')
def download_formalism_text(fragment_id):
    """
    Download the formalism text for a regulation fragment.

    :param fragment_id: The ID of the regulation fragment.
    :return: The formalism text as a downloadable file.
    """
    explanation_service = container.explanation_service()
    formalism_text = explanation_service.get_formalism_text(int(fragment_id))
    return Response(
        formalism_text,
        mimetype="text/plain",
        headers={"Content-Disposition": "attachment;filename=formalism.txt"}
    )
