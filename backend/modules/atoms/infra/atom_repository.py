from modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from modules.atoms.application.dto.create_atom_span_dto import CreateAtomSpanDTO
from modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO

from db_models import AtomSpan, Atom

class AtomRepository:
    def __init__(self, db):
        self.db = db

    def save(self, atom: CreateAtomDTO) -> Atom:
        atom = Atom(
            regulation_fragment_id=atom.regulation_fragment_id,
            description=atom.description,
            predicate=atom.predicate,
            is_negated=atom.is_negated,
        )

        self.db.session.add(atom)
        self.db.session.commit()
        return atom

    def save_span(self, atom_span: CreateAtomSpanDTO) -> AtomSpan:
        atom_span = AtomSpan(
            atom_id=atom_span.atom_id,
            start=atom_span.start,
            end=atom_span.end,
        )
        self.db.session.add(atom_span)
        self.db.session.commit()
        return atom_span

    def update(self, atom: UpdateAtomDTO) -> Atom:
        existing_atom = self.db.query(Atom).filter(Atom.id == atom.id).first()
        if not existing_atom:
            raise ValueError("Atom not found")
        existing_atom.description = atom.description
        self.db.session.add(existing_atom)
        self.db.session.commit()
        return existing_atom

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int) -> list[Atom]:
        return Atom.query.filter(Atom.regulation_fragment_id == regulation_fragment_id).all()

    def delete_by_regulation_fragment_id(self, regulation_fragment_id: int) -> int:
        """
        Delete all atoms and their spans for a specific regulation fragment.
        Returns the number of atoms deleted.
        """
        atoms = self.find_by_regulation_fragment_id(regulation_fragment_id)
        count = 0

        for atom in atoms:
            # Delete all spans for this atom
            self.db.session.query(AtomSpan).filter(AtomSpan.atom_id == atom.id).delete()
            count += 1

        # Delete all atoms for this fragment
        self.db.session.query(Atom).filter(Atom.regulation_fragment_id == regulation_fragment_id).delete()

        self.db.session.commit()
        return count
