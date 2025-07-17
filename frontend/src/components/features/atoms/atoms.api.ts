import { AtomDTO } from '@dtos/dto-types';

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
