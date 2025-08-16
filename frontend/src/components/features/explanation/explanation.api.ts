import { ExamplesDTO, PrologHttpResponseDTO, PrologQueryDTO } from '@dtos/dto-types';

/**
 * Fetch the formalism text for a specific regulation fragment
 * @param regulationFragmentId The ID of the regulation fragment
 * @returns Promise with the formalism text
 */
export async function getFormalism(
  regulationFragmentId: number
): Promise<{ text: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/formalism`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch formalism text');
  }

  return await res.json();
}

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

/**
 * Generate examples for a specific regulation fragment
 * @param regulationFragmentId The ID of the regulation fragment
 * @returns Promise with the generated examples
 */
export async function generateExamples(
  regulationFragmentId: number
): Promise<ExamplesDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/generate-examples`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to generate examples for regulation fragment');
  }

  return await res.json();
}
