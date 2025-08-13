'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAtomById } from '@/components/features/atoms/atoms.api';

/**
 * Hook to delete an atom by ID
 * @returns Mutation function and state for deleting an atom
 */
export function useDeleteAtom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (atomId: number) => deleteAtomById(atomId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['atoms'] }),
  });
}
