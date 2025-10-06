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
