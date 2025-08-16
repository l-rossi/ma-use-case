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
