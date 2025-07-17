'use client';

import { useQuery } from '@tanstack/react-query';
import { getAtomsForFragment } from '@/components/features/atoms/atoms.api';

/**
 * Hook to fetch atoms for a specific fragment ID
 * @param fragmentId The ID of the regulation fragment
 * @returns Query result with atoms data, loading and error states
 */
export function useAtoms(fragmentId: number | null) {
  return useQuery({
    queryKey: ['atoms', fragmentId],
    queryFn: () => getAtomsForFragment(fragmentId!),
    enabled: !!fragmentId,
  });
}