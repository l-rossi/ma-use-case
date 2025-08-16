from modules.atoms.application.atom_service import AtomService
from modules.atoms.application.atom_util import create_wildcard_predicates, atoms_to_dynamic_statement
from modules.common.util import format_prolog_knowledge_base
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
        self._rule_service = rule_service
        self._prolog_reasoner = prolog_reasoner
        self._atom_service = atom_service

    def run_example(self,
                    regulation_fragment_id: int,
                    facts: str):
        """
        Run a Prolog query with the given query string.

        :param facts: A string containing facts to be used in the Prolog query.
        :param regulation_fragment_id: The ID of the regulation fragment to be used in the Prolog query.
        :return:
        """

        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id)
        rules = self._rule_service.get_rules_for_regulation_fragment(regulation_fragment_id)

        sorted_facts = "\n".join(sorted(facts.split("\n")))
        knowledge_base = format_prolog_knowledge_base(
            atoms,
            rules,
        ) + "\n" + sorted_facts

        # TODO this raises if no rules are found, should handle this case
        goal, _ = create_wildcard_predicates(
            next(rule for rule in rules if rule.is_goal).definition.split(":-")[0].strip(),
            wildcard_factory=lambda x: f"X{x}")

        print(knowledge_base)
        print(goal)

        return self._prolog_reasoner.execute_prolog(
            knowledge_base=knowledge_base,
            goal=goal
        )
