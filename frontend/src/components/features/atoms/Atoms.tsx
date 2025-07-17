'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { deleteAtomsForFragment, generateAtomsForFragment } from './atoms.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { AtomView } from '@/components/features/atoms/AtomView';
import { useState } from 'react';
import { AtomDTO } from '@dtos/dto-types';

interface Props {
  className?: string;
}

export function Atoms({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const [selectedAtom, setSelectedAtom] = useState<AtomDTO | null>(null);

  const { data: atoms = [], isPending, isError, refetch } = useAtoms(selectedFragmentId);

  const queryClient = useQueryClient();
  const generateAtomsMutation = useMutation({
    mutationFn: () => generateAtomsForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['atoms', selectedFragmentId],
      }),
  });

  const deleteAtomsMutation = useMutation({
    mutationFn: () => deleteAtomsForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['atoms', selectedFragmentId],
      }),
  });

  if (!selectedFragmentId) {
    return (
      <Box className={cn('shadow-sky-500 flex items-center justify-center p-4', className)}>
        Please select a fragment first
      </Box>
    );
  }

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError) {
    return (
      <Box
        className={cn(
          'text-red-500 shadow-sky-500 p-4 flex flex-col items-center justify-center',
          className
        )}
      >
        <p className="mb-4">Failed to load atoms.</p>
        <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (atoms.length === 0) {
    return (
      <Box
        className={cn('shadow-sky-500 p-4 flex flex-col items-center justify-center', className)}
      >
        <p className="mb-4">No atoms found for this fragment</p>
        <Button
          variant={'outline'}
          type={'button'}
          onClick={() => generateAtomsMutation.mutate()}
          disabled={generateAtomsMutation.isPending}
        >
          {generateAtomsMutation.isPending ? 'Generating...' : 'Generate Atoms'}
        </Button>
      </Box>
    );
  }

  return (
    <Box className={cn('shadow-sky-500 flex-col overflow-hidden p-4', className)}>
      <div className="flex justify items-center mb-2 gap-1">
        <h3 className="text-lg font-semibold">Atoms</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteAtomsMutation.mutate()}
          disabled={deleteAtomsMutation.isPending}
          title="Delete all atoms for this fragment"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className={'grid grid-cols-2 overflow-hidden gap-2'}>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {atoms.map(atom => (
            <button
              key={atom.id}
              onClick={() => setSelectedAtom(atom)}
              className={cn(
                'cursor-pointer active:bg-gray-200 border',
                selectedAtom?.id === atom.id && 'border-gray-500'
              )}
            >
              <AtomView atom={atom} />
            </button>
          ))}
        </div>

        <div className={'flex flex-col'}>
          {selectedAtom ? (
            <>
              <p className={'flex-1 overflow-y-auto'}>{selectedAtom.description}</p>
              {selectedAtom.spans.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <span>
                    {selectedAtom.spans.length} text reference
                    {selectedAtom.spans.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className={'m-auto underline'}>Select an Atom for more Info</p>
          )}
        </div>
      </div>
    </Box>
  );
}
