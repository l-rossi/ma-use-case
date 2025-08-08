import { RuleDTO, CreateRuleDTO, UpdateRuleDTO, RegenerateRulesDTO } from '@dtos/dto-types';

/**
 * Regenerate rules for a specific regulation fragment with feedback
 * @param fragmentId The ID of the regulation fragment
 * @param dto Data Transfer Object containing feedback for regeneration
 * @returns Promise that resolves when rules are regenerated
 */
export async function regenerateRulesForFragment(
  fragmentId: number,
  dto: RegenerateRulesDTO
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/rules/regenerate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to regenerate rules for regulation fragment');
  }
}

/**
 * Get all rules for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise with an array of RuleDTO objects
 */
export async function getRulesForFragment(fragmentId: number): Promise<Array<RuleDTO>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/rules`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch rules for regulation fragment');
  }

  return await res.json();
}

/**
 * Generate rules for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise that resolves when rules are generated
 */
export async function generateRulesForFragment(fragmentId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/rules/generate`,
    {
      method: 'POST',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to generate rules for regulation fragment');
  }
}

/**
 * Delete all rules for a specific regulation fragment
 * @param fragmentId The ID of the regulation fragment
 * @returns Promise that resolves when rules are deleted
 */
export async function deleteRulesForFragment(fragmentId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/rules`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete rules for regulation fragment');
  }
}

/**
 * Delete a single rule by its ID
 * @param regulationFragmentId The ID of the regulation fragment containing the rule
 * @param ruleId The ID of the rule to delete
 * @returns Promise that resolves when the rule is deleted
 */
export async function deleteRuleById(regulationFragmentId: number, ruleId: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/rules/${ruleId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete rule');
  }
}

/**
 * Update a rule
 * @param regulationFragmentId The ID of the regulation fragment containing the rule
 * @param ruleId The ID of the rule to update
 * @param dto The UpdateRuleDTO containing the rule data to update
 * @returns Promise with the updated RuleDTO
 */
export async function updateRule(regulationFragmentId: number, ruleId: number, dto: UpdateRuleDTO): Promise<RuleDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/rules/${ruleId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to update rule');
  }

  return await res.json();
}

/**
 * Create a new rule
 * @param regulationFragmentId The ID of the regulation fragment to create the rule for
 * @param dto The CreateRuleDTO containing the rule data to create
 * @returns Promise with the created RuleDTO
 */
export async function createRule(regulationFragmentId: number, dto: CreateRuleDTO): Promise<RuleDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/rules`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to create rule');
  }

  return await res.json();
}
