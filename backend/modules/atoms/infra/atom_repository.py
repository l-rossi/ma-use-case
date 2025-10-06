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

from db_models import AtomSpan, Atom
from modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from modules.atoms.application.dto.create_atom_span_dto import CreateAtomSpanDTO
from modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO


class AtomRepository:
    def __init__(self, db):
        self.db = db

    def save(self, atom: CreateAtomDTO) -> Atom:
        atom = Atom(
            regulation_fragment_id=atom.regulation_fragment_id,
            description=atom.description,
            predicate=atom.predicate,
            is_negated=atom.is_negated,
            is_fact=atom.is_fact,
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

    def update(self, atom_id: int, atom: UpdateAtomDTO) -> Atom:
        existing_atom = Atom.query.filter(Atom.id == atom_id).one()
        if not existing_atom:
            raise ValueError("Atom not found")

        if atom.predicate is not None:
            existing_atom.predicate = atom.predicate
        if atom.description is not None:
            existing_atom.description = atom.description
        if atom.is_negated is not None:
            existing_atom.is_negated = atom.is_negated
        if atom.is_fact is not None:
            existing_atom.is_fact = atom.is_fact

        self.db.session.add(existing_atom)
        self.db.session.commit()
        return existing_atom

    def find_by_regulation_fragment_id(self, regulation_fragment_id: int) -> list[Atom]:
        return Atom.query.filter(Atom.regulation_fragment_id == regulation_fragment_id).order_by(Atom.is_fact.desc()).all()

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

    def delete_by_id(self, atom_id: int) -> bool:
        """
        Delete an atom by its ID.
        :param atom_id: int ID of the atom to delete
        """
        atom = Atom.query.filter_by(id=atom_id).one()
        if atom is None:
            return False
        self.db.session.delete(atom)
        self.db.session.commit()
        return True
