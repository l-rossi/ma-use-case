import { CreateRegulationFragmentDTO, RegulationFragmentDTO } from '../../generated/types';

export async function createRegulationFragment(
  fragment: CreateRegulationFragmentDTO
): Promise<RegulationFragmentDTO> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fragment),
  });

  if (!res.ok) {
    throw new Error('Failed to create regulation fragment');
  }

  return await res.json();
}

export async function getRegulationFragments(): Promise<Array<RegulationFragmentDTO>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments`);

  if (!res.ok) {
    throw new Error('Failed to fetch regulation fragments');
  }

  return await res.json();
}

export async function deleteRegulationFragment(id: number): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete regulation fragment');
  }
}
