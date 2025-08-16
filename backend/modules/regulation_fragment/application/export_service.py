from modules.atoms.application.atom_service import AtomService
from modules.common.util import format_prolog_knowledge_base
from modules.regulation_fragment.application.regulation_fragment_service import RegulationFragmentService
from modules.regulation_fragment.domain import Formalism
from modules.rules.application.rule_service import RuleService


class ExportService:
    """
    ExportService is a service that provides methods for exporting regulation fragments.
    (Extracted from the regulation fragment service to avoid circular dependencies)
    """

    def __init__(self,
                 regulation_fragment_service: RegulationFragmentService,
                 atom_service: AtomService,
                 rule_service: RuleService,
                 ):
        self._regulation_fragment_service = regulation_fragment_service
        self._atom_service = atom_service
        self._rule_service = rule_service

    def export_regulation_fragment(self, regulation_fragment_id: int) -> str:
        """
        Export the regulation fragment with the given ID.

        :param regulation_fragment_id: The ID of the regulation fragment to export.
        :return: A string containing the exported regulation fragment.
        """
        fragment = self._regulation_fragment_service.find_by_id(
            regulation_fragment_id
        )

        if fragment.formalism != Formalism.PROLOG:
            raise ValueError(
                f"Export currently only supports Prolog formalism, but got {fragment.formalism.name}"
            )

        atoms = self._atom_service.get_atoms_for_regulation_fragment(regulation_fragment_id) or []
        rules = self._rule_service.get_rules_for_regulation_fragment(regulation_fragment_id) or []

        return format_prolog_knowledge_base(
            atoms=atoms,
            rules=rules,
        )
