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

from flask import Blueprint, request, jsonify, Response
from di_container import container
from modules.regulation_fragment.application.dto.create_regulation_fragment_dto import \
    CreateRegulationFragmentDTO

regulation_fragment_controller = Blueprint('regulation_fragment', __name__)


@regulation_fragment_controller.get('/regulation-fragments/<fragment_id>/export')
def export_fragment(fragment_id: str):
    print(fragment_id)
    content = container.export_service().export_regulation_fragment(int(fragment_id))
    return Response(
        content,
        mimetype="text/plain",
        headers={"Content-Disposition": "attachment;filename=export.txt"}
    )


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
