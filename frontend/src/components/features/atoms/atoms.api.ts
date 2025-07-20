import { AtomDTO, CreateAtomDTO, RegenerateAtomsDTO, UpdateAtomDTO } from '@dtos/dto-types';

/**
 * Regenerate atoms for a specific regulation fragment with feedback
 * @param fragmentId The ID of the regulation fragment
 * @param dto Data Transfer Object containing feedback for regeneration
 * @returns Promise that resolves when atoms are regenerated
 */
export async function regenerateAtomsForFragment(
  fragmentId: number,
  dto: RegenerateAtomsDTO
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/atoms/regenerate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to regenerate atoms for regulation fragment');
  }
}

/**
 * Get all atoms for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise with an array of AtomDTO objects
 */
export async function getAtomsForFragment(fragmentId: number): Promise<Array<AtomDTO>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/atoms`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch atoms for regulation fragment');
  }

  return await res.json();
}

/**
 * Generate atoms for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise that resolves when atoms are generated
 */
export async function generateAtomsForFragment(fragmentId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/atoms/generate`,
    {
      method: 'POST',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to generate atoms for regulation fragment');
  }
}

/**
 * Delete all atoms for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise that resolves when atoms are deleted
 */
export async function deleteAtomsForFragment(fragmentId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/atoms`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete atoms for regulation fragment');
  }
}

/**
 * Delete a single atom by its ID
 * @param atomId The ID of the atom to delete
 * @returns Promise that resolves when the atom is deleted
 */
export async function deleteAtomById(atomId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atoms/${atomId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete atom');
  }
}

/**
 * Update an atom
 * @param dto The UpdateAtomDTO containing the atom data to update
 * @returns Promise with the updated AtomDTO
 */
export async function updateAtom(dto: UpdateAtomDTO): Promise<AtomDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atoms/${dto.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to update atom');
  }

  return await res.json();
}

/**
 * Create a new atom
 * @param dto The CreateAtomDTO containing the atom data to create
 * @returns Promise with the created AtomDTO
 */
export async function createAtom(dto: CreateAtomDTO): Promise<AtomDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atoms`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to create atom');
  }

  return await res.json();
}
