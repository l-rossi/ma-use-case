'use client';

import { useQuery } from '@tanstack/react-query';
import { getRegulationFragments } from '@/components/features/regulation-fragments/regulation-fragments.api';
import { cn } from '@/lib/utils';
import { useMemo, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateRegulationFragmentForm } from '@/components/features/regulation-fragments/CreateRegulationsFragmentForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { RegulationFragmentSelectionDrawer } from '@/components/features/regulation-fragments/RegulationFragmentSelectionDrawer';
import { Box } from '@/components/ui/Box';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { RegulationFragmentView } from '@/components/features/regulation-fragments/RegulationFragmentView';

interface Props {
  className?: string;
}

export function RegulationFragments({ className }: Readonly<Props>) {
  const {
    data: fragments = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['regulation-fragments'],
    queryFn: () => getRegulationFragments(),
  });

  const [selectedFragmentId, setSelectedFragmentId] = useSelectedRegulationFragmentId();
  const selectedFragment = useMemo(
    () => fragments.find(fragment => fragment.id === selectedFragmentId),
    [fragments, selectedFragmentId]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError) {
    return (
      <Box
        title={'Regulation Fragments'}
        className={cn(
          'text-red-500 shadow-red-500 flex flex-col items-center justify-center gap-4',
          className
        )}
      >
        Failed to load regulation fragments.
        <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className={cn('shadow-orange-500 flex flex-row', className)} ref={containerRef}>
      <RegulationFragmentSelectionDrawer
        onSelect={id => {
          setSelectedFragmentId(id);
          setIsCreateModalOpen(false);
        }}
        fragments={fragments}
        container={containerRef}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'outline'}
            className={'absolute top-2 right-12 z-10'}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className={'size-4'} />
            Add Regulation Fragment
          </Button>
        </DialogTrigger>
        <DialogContent className={'bg-gray-200 text-neutral-800'}>
          <DialogHeader>
            <DialogTitle>Add Regulation Fragment</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>
                Create a new regulation fragment to add to the list.
              </DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <CreateRegulationFragmentForm
            onSuccess={async f => {
              setIsCreateModalOpen(false);
              await setSelectedFragmentId(f.id);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className={'flex-grow flex flex-col size-full overflow-auto p-4'}>
        <h3 className="text-lg font-semibold">Regulation Fragments</h3>
        {fragments?.length === 0 && (
          <CreateRegulationFragmentForm
            className={'size-full mt-8'}
            onSuccess={async f => {
              await setSelectedFragmentId(f.id);
            }}
          />
        )}

        {selectedFragment && <RegulationFragmentView fragment={selectedFragment} />}
      </div>
    </Box>
  );
}
