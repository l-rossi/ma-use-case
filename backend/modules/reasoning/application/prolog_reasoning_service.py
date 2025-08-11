from modules.reasoning.application.prolog_reasoner import PrologReasoner
from modules.rules.application.rule_service import RuleService


class PrologReasoningService:
    """
    A service for reasoning with Prolog.
    This class is a placeholder for future implementation.
    """

    def __init__(self,
                 rule_service: RuleService,
                 prolog_reasoner: PrologReasoner
                 ):
        self.rule_service = rule_service
        self.prolog_reasoner = prolog_reasoner

    def run_example(self,
                    regulation_fragment_id: int,
                    facts: str):
        """
        Run a Prolog query with the given query string.

        :param query_string:
        :return:
        """

        # Get rules for the regulation fragment
        rules = self.rule_service.get_rules_by_regulation_id(regulation_fragment_id)
        rule_definitions = "\n".join(rule.definition for rule in rules) + "\n" + facts


        return self.prolog_reasoner.execute_prolog(
            knowledge_base=rule_definitions,
            goal="TODO"
        )
