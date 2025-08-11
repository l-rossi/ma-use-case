import { PrologHttpResponseDTO, PrologQueryDTO } from '@dtos/dto-types';

/**
 * Execute a Prolog query with user-provided facts for a specific regulation fragment
 * @param regulationFragmentId The ID of the regulation fragment
 * @param dto The Prolog query data transfer object containing facts
 * @returns Promise with the query results
 */
export async function runExample(
  regulationFragmentId: number,
  dto: PrologQueryDTO
): Promise<PrologHttpResponseDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/run-example`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to execute Prolog query with examples');
  }

  return await res.json();
}