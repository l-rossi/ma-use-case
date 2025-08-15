import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateAtomsForFragment } from '@/components/features/atoms/atoms.api';

export function useRegenerateAtoms({
  fragmentId,
  feedback,
  onSuccess,
}: {
  fragmentId: number;
  feedback: string;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateAtomsForFragment(fragmentId, { feedback }),
    mutationKey: ['regenerateAtoms', fragmentId],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['atoms', fragmentId],
      }),
    onSuccess: onSuccess,
  });
}
