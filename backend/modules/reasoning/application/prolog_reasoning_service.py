from modules.atoms.application.atom_service import AtomService
from modules.atoms.application.atom_util import create_wildcard_predicates, mask_variables_in_atoms, \
    atoms_to_dynamic_statement
from modules.reasoning.application.prolog_reasoner import PrologReasoner
from modules.rules.application.rule_service import RuleService


class PrologReasoningService:
    """
    A service for reasoning with Prolog.
    This class is a placeholder for future implementation.
    """

    def __init__(self,
                 rule_service: RuleService,
                 atom_service: AtomService,
                 prolog_reasoner: PrologReasoner,
                 ):
        self.rule_service = rule_service
        self.prolog_reasoner = prolog_reasoner
        self.atom_service = atom_service

    def run_example(self,
                    regulation_fragment_id: int,
                    facts: str):
        """
        Run a Prolog query with the given query string.

        :param facts: A string containing facts to be used in the Prolog query.
        :param regulation_fragment_id: The ID of the regulation fragment to be used in the Prolog query.
        :return:
        """

        atoms = self.atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)

        # To make sure everything is defined at least once using dynamic:
        # :- dynamic atom/arity.
        rule_definitions = "\n".join(
            atoms_to_dynamic_statement(atom) for atom in atoms
        )

        # Get rules for the regulation fragment
        rules = self.rule_service.get_rules_by_regulation_id(regulation_fragment_id)
        rule_definitions += "\n"
        rule_definitions += "\n".join(rule.definition for rule in rules) + "\n" + facts

        # TODO this raises if no rules are found, should handle this case
        goal, _ = create_wildcard_predicates(
            next(rule for rule in rules if rule.is_goal).definition.split(":-")[0].strip(),
            wildcard_factory=lambda x: f"X{x}")

        print(rule_definitions)
        print(goal)

        return self.prolog_reasoner.execute_prolog(
            knowledge_base=rule_definitions,
            goal=goal
        )
