from flask import Blueprint, request
from modules.atoms.application.dto.regenerate_atoms_dto import RegenerateAtomsDTO
from modules.atoms.application.dto.update_atom_dto import UpdateAtomDTO
from modules.atoms.application.dto.create_atom_dto import CreateAtomDTO
from di_container import container

atom_controller = Blueprint('atom', __name__)


@atom_controller.get('/regulation-fragments/<fragment_id>/atoms')
def get_atoms_for_fragment(fragment_id: str):
    """
    Get all atoms for a specific regulation fragment.
    """
    atom_service = container.atom_service()
    atoms = atom_service.get_atoms_for_regulation_fragment(fragment_id)
    return [atom.model_dump() for atom in atoms], 200


@atom_controller.post('/regulation-fragments/<fragment_id>/atoms/generate')
def generate_atoms_for_fragment(fragment_id: str):
    """
    Generate atoms for a specific regulation fragment.
    """
    atom_service = container.atom_service()
    atom_service.generate_atoms_for_regulation_fragment(fragment_id)
    return '', 204


@atom_controller.delete('/regulation-fragments/<fragment_id>/atoms')
def delete_atoms_for_fragment(fragment_id: str):
    """
    Delete all atoms for a specific regulation fragment.
    """
    atom_service = container.atom_service()
    count = atom_service.delete_atoms_for_regulation_fragment(fragment_id)
    rule_service = container.rule_service()
    rule_service.delete_rules_for_regulation_fragment(fragment_id)
    return {'deleted': count}, 200


@atom_controller.post('/regulation-fragments/<fragment_id>/atoms/regenerate')
def regenerate_atoms_for_fragment(fragment_id: str):
    """
    Regenerate atoms for a specific regulation fragment based on feedback.
    """
    regenerate_data = RegenerateAtomsDTO(**request.get_json())
    atom_service = container.atom_service()
    atom_service.regenerate_atoms_for_regulation_fragment(fragment_id, regenerate_data)
    return '', 204


@atom_controller.delete('/atoms/<atom_id>')
def delete_atom_by_id(atom_id: str):
    """
    Delete an atom by its ID.
    """
    atom_service = container.atom_service()
    success = atom_service.delete_atom_by_id(atom_id)
    if success:
        return '', 204
    else:
        return {'error': 'Atom not found'}, 404


@atom_controller.patch('/atoms/<atom_id>')
def update_atom(atom_id: str):
    """
    Update an atom by its ID.
    """
    data = request.get_json()

    update_dto = UpdateAtomDTO(**data)
    atom_service = container.atom_service()

    try:
        updated_atom = atom_service.update_atom(atom_id, update_dto)
        return updated_atom.model_dump(), 200
    except ValueError as e:
        return {'error': str(e)}, 404


@atom_controller.post('/atoms')
def create_atom():
    """
    Create a new atom.
    """
    data = request.get_json()
    create_dto = CreateAtomDTO(**data)
    atom_service = container.atom_service()

    try:
        created_atom = atom_service.create_atom(create_dto)
        return created_atom.model_dump(), 201
    except ValueError as e:
        return {'error': str(e)}, 400
