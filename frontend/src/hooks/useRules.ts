'use client';

import { useQuery } from '@tanstack/react-query';
import { getRulesForFragment } from '@/components/features/rules/rules.api';

/**
 * Hook to fetch rules for a specific fragment ID
 * @param fragmentId The ID of the regulation fragment
 * @returns Query result with rules data, loading and error states
 */
export function useRules(fragmentId: number | null) {
  return useQuery({
    queryKey: ['rules', fragmentId],
    queryFn: () => getRulesForFragment(fragmentId!),
    enabled: !!fragmentId,
  });
}