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
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.application.dto.regenerate_rules_dto import RegenerateRulesDTO
from modules.rules.application.dto.update_rule_dto import UpdateRuleDTO
from di_container import container

rule_controller = Blueprint('rule', __name__)


@rule_controller.get('/regulation-fragments/<fragment_id>/rules')
def get_rules_for_fragment(fragment_id: str):
    """
    Get all rules for a specific regulation fragment.
    """
    rule_service = container.rule_service()
    rules = rule_service.get_rules_for_regulation_fragment(fragment_id)
    return [rule.model_dump() for rule in rules], 200


@rule_controller.post('/regulation-fragments/<fragment_id>/rules/generate')
def generate_rules_for_fragment(fragment_id: str):
    """
    Generate rules for a specific regulation fragment.
    """
    rule_service = container.rule_service()
    rule_service.generate_rules_for_regulation_fragment(fragment_id)
    return '', 204


@rule_controller.delete('/regulation-fragments/<fragment_id>/rules')
def delete_rules_for_fragment(fragment_id: str):
    """
    Delete all rules for a specific regulation fragment.
    """
    rule_service = container.rule_service()
    count = rule_service.delete_rules_for_regulation_fragment(fragment_id)
    return {'deleted': count}, 200


@rule_controller.post('/regulation-fragments/<fragment_id>/rules/regenerate')
def regenerate_rules_for_fragment(fragment_id: str):
    """
    Regenerate rules for a specific regulation fragment based on feedback.
    """
    regenerate_data = RegenerateRulesDTO(**request.get_json())
    rule_service = container.rule_service()
    rule_service.regenerate_rules_for_regulation_fragment(fragment_id, regenerate_data)
    return '', 204


@rule_controller.delete('/rules/<rule_id>')
def delete_rule_by_id(rule_id: str):
    """
    Delete a rule by its ID.
    """
    rule_service = container.rule_service()
    success = rule_service.delete_rule(rule_id)
    if success:
        return '', 204
    else:
        return {'error': 'Rule not found'}, 404


@rule_controller.put('/rules/<rule_id>')
def update_rule(rule_id: str):
    """
    Update a rule by its ID.
    """
    data = request.get_json()
    data['id'] = int(rule_id)  # Ensure the ID in the path is used

    update_dto = UpdateRuleDTO(**data)
    rule_service = container.rule_service()

    try:
        updated_rule = rule_service.update_rule(rule_id, update_dto)
        return updated_rule.model_dump(), 200
    except ValueError as e:
        return {'error': str(e)}, 404


@rule_controller.post('/rules')
def create_rule():
    """
    Create a new rule.
    """
    data = request.get_json()
    create_dto = CreateRuleDTO(**data)
    rule_service = container.rule_service()

    try:
        created_rule = rule_service.create_rule(create_dto)
        return created_rule.model_dump(), 201
    except ValueError as e:
        return {'error': str(e)}, 400