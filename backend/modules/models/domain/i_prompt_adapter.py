from abc import ABC, abstractmethod
from typing import List, Optional
from lxml import etree

from modules.atoms.application.atom_util import insert_atom_spans
from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.atoms.application.dto.atom_extraction_result_dto import AtomExtractionResultDTO, ExtractedAtomDTO
from modules.atoms.application.dto.atom_span_dto import AtomSpanDTO
from modules.rules.application.dto.rule_dto import RuleDTO
from modules.rules.application.dto.rule_extraction_result_dto import RuleExtractionResultDTO


class IPromptAdapter(ABC):

    @abstractmethod
    def chat_system_prompt(self,
                           regulation_content: str,
                           atoms: List[AtomDTO],
                           rules: List[RuleDTO],
                           ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def rule_extraction_prompt(self,
                               regulation_content: str,
                               atoms: List[AtomDTO]
                               ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def rule_regeneration_prompt(self,
                                 regulation_content: str,
                                 atoms: List[AtomDTO],
                                 rules: List[RuleDTO],
                                 feedback: Optional[str]
                                 ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def rule_extraction_retry_prompt(self,
                                     original_prompt: str,
                                     previous_response: str,
                                     error_message: str,
                                     ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def atom_extraction_prompt(self,
                               regulation_content: str,
                               ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def atom_regeneration_prompt(self,
                                 regulation_content: str,
                                 atoms: List[AtomDTO],
                                 feedback: str,
                                 ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def atom_regeneration_retry_prompt(self,
                                       error_message: str,
                                       ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def atom_extraction_retry_prompt(self,
                                     error_message: str,
                                     ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def example_generation_prompt(self,
                                  atoms: List[AtomDTO],
                                  rules: List[RuleDTO],
                                  ) -> str:
        raise NotImplementedError()

    @abstractmethod
    def example_generation_retry_prompt(self,
                                        error_message: str,
                                        ) -> str:
        raise NotImplementedError()

    @staticmethod
    def _atoms_to_xml(
            fragment_content: str,
            atoms: List[AtomDTO]) -> str:
        # I am guessing lower numbers are better for LLM performance, so we normalize IDs to start from 1 to reduce confusion.
        db_id_to_normalized_id = {atom.id: idx for idx, atom in enumerate(atoms, start=1)}

        return AtomExtractionResultDTO(
            annotated_raw=etree.fromstring(f"""<annotated>{insert_atom_spans(
                fragment_content,
                [AtomSpanDTO(
                    id=span.id,
                    atom_id=db_id_to_normalized_id[span.atom_id],
                    start=span.start,
                    end=span.end
                ) for atom in atoms for span in atom.spans],
            )}</annotated>"""),
            atoms=[
                ExtractedAtomDTO(
                    id=db_id_to_normalized_id[atom.id],
                    predicate=atom.predicate,
                    description=atom.description,
                    is_fact=atom.is_fact,
                ) for atom in atoms
            ]
        ).to_xml().decode('utf-8')

    @staticmethod
    def _atom_predicates_as_list(atoms: List[AtomDTO]) -> str:
        return "\n".join(
            map(lambda atom: "-" + atom.predicate, atoms)
        )

    @staticmethod
    def _atoms_predicates_as_verbose_list(atoms: List[AtomDTO]) -> str:
        return "\n".join(
            map(lambda atom: f"- {atom.predicate}: {atom.description} ({'fact' if atom.is_fact else 'derived'})", atoms)
        )

    @staticmethod
    def _rules_as_list(rules: List[RuleDTO]) -> str:
        return "\n".join(
            map(lambda rule: f"- {rule.definition}\n  Description: {rule.description}", rules)
        )
