from flask import Blueprint, request
from modules.atoms.application.dto.regenerate_atoms_dto import RegenerateAtomsDTO
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
