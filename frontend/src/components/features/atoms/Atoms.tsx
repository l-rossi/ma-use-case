'use client';

import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { generateAtomsForFragment } from './atoms.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface Props {
  className?: string;
}

export function Atoms({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const {
    data: atoms = [],
    isPending,
    isError,
    refetch,
  } = useAtoms(selectedFragmentId);

  const generateAtomsMutation = useMutation({
    mutationFn: () => selectedFragmentId ? generateAtomsForFragment(selectedFragmentId) : Promise.resolve(),
    onSuccess: () => {
      // Refetch atoms after successful generation
      refetch();
    },
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
      <Box className={cn('shadow-sky-500 p-4 flex flex-col items-center justify-center', className)}>
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
    <Box className={cn('shadow-sky-500', className)}>
      <div className="p-4 overflow-hidden">
        <h3 className="text-lg font-semibold mb-2">Atoms</h3>
        <pre className={"overflow-scroll size-full py-2"}>{JSON.stringify(atoms, null, 2)}</pre>
      </div>
    </Box>
  );
}
