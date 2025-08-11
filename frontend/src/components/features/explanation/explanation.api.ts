import { PrologAnswerDTO } from '@dtos/dto-types';

/**
 * Execute a Prolog query with user-provided facts for a specific regulation fragment
 * @param regulationFragmentId The ID of the regulation fragment
 * @param facts Dictionary mapping predicate templates to lists of values
 * @param goal Optional goal to query
 * @returns Promise with the query results
 */
export async function executeWithExamples(
  regulationFragmentId: number,
  facts: Record<string, string[]>,
  goal?: string
): Promise<{
  status: 'success' | 'failure' | 'error';
  answers: PrologAnswerDTO[];
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/run-example`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facts,
        goal,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to execute Prolog query with examples');
  }

  return await res.json();
}