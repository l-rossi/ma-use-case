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
