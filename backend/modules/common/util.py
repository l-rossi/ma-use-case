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

from typing import List

from modules.atoms.application.atom_util import atoms_to_dynamic_statement
from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.rules.application.dto.rule_dto import RuleDTO


def format_prolog_knowledge_base(
        atoms: List[AtomDTO],
        rules: List[RuleDTO],
) -> str:
    """
    Format the knowledge base for Prolog reasoning.
    :param atoms: Atoms / dynamic predicates to be included in the knowledge base.
    :param rules: Rules to be included in the knowledge base.
    :return:
    """
    knowledge_base = "\n".join(sorted(
        atoms_to_dynamic_statement(atom) for atom in atoms
    ))

    knowledge_base += "\n"
    knowledge_base += "\n".join(sorted(rule.definition for rule in rules))
    return knowledge_base
