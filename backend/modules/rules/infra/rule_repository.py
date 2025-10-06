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

from typing import List, Optional

from flask_sqlalchemy import SQLAlchemy

from db_models import Rule
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.application.dto.update_rule_dto import UpdateRuleDTO


class RuleRepository:
    """
    Repository for managing rules in the database.
    Provides methods for creating, updating, and finding rules.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, rule_data: CreateRuleDTO) -> Rule:
        """
        Create a new rule in the database.
        
        Args:
            rule_data: The data for the new rule
            
        Returns:
            The created rule entity
        """
        rule = Rule(
            regulation_fragment_id=rule_data.regulation_fragment_id,
            description=rule_data.description,
            definition=rule_data.definition,
            is_goal=rule_data.is_goal,
        )

        self.db.session.add(rule)
        self.db.session.commit()

        return rule

    def update(self, rule_id: int, rule_data: UpdateRuleDTO) -> Optional[Rule]:
        """
        Update an existing rule in the database.
        
        Args:
            rule_id: The ID of the rule to update
            rule_data: The data to update the rule with
            
        Returns:
            The updated rule entity or None if the rule was not found
        """
        rule = Rule.query.get(rule_id)

        if not rule:
            return None

        if rule_data.description is not None:
            rule.description = rule_data.description
        if rule_data.definition is not None:
            rule.definition = rule_data.definition
        if rule_data.is_goal is not None:
            rule.is_goal = rule_data.is_goal

        self.db.session.add(rule)
        self.db.session.commit()

        return rule

    def find_by_regulation_id(self, regulation_fragment_id: int) -> List[Rule]:
        """
        Find all rules for a specific regulation fragment.
        
        Args:
            regulation_fragment_id: The ID of the regulation fragment
            
        Returns:
            A list of rules for the specified regulation fragment
        """
        return Rule.query.filter(Rule.regulation_fragment_id == regulation_fragment_id).all()

    def find_by_id(self, rule_id: int) -> Optional[Rule]:
        """
        Find a rule by its ID.
        
        Args:
            rule_id: The ID of the rule to find
            
        Returns:
            The rule entity or None if not found
        """
        return Rule.query.get(rule_id)

    def delete_by_id(self, rule_id: int) -> bool:
        """
        Delete a rule by its ID.
        
        Args:
            rule_id: The ID of the rule to delete
            
        Returns:
            True if the rule was deleted, False if it wasn't found
        """
        rule = Rule.query.get(rule_id)

        if not rule:
            return False

        self.db.session.delete(rule)
        self.db.session.commit()

        return True