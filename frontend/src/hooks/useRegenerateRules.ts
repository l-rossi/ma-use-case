'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateRulesForFragment } from '@/components/features/rules/rules.api';

interface UseRegenerateRulesOptions {
  fragmentId: number;
  feedback: string;
  onSuccess?: () => void;
}

export function useRegenerateRules({ fragmentId, feedback, onSuccess }: UseRegenerateRulesOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateRulesForFragment(fragmentId, { feedback }),
    mutationKey: ['regenerateRules', fragmentId],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['rules', fragmentId],
      }),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
}