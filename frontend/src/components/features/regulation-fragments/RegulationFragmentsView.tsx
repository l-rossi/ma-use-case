'use client';

import { useQuery } from '@tanstack/react-query';
import { getRegulationFragments } from '@/api/regulation_fragments';
import { parseAsInteger, useQueryState } from 'nuqs';
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

interface Props {
  className?: string;
}

export function RegulationFragmentsView({ className }: Readonly<Props>) {
  const {
    data: fragments = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['regulation-fragments'],
    queryFn: () => getRegulationFragments(),
  });

  const [selectedFragmentId, setSelectedFragmentId] = useQueryState(
    'selectedFragment',
    parseAsInteger
  );
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
      <div
        className={cn(
          'text-red-500 size-full bg-gray-200 rounded-md flex flex-col gap-2 items-center justify-center text-2xl font-bold',
          className
        )}
      >
        Failed to load regulation fragments.
        <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-md  relative flex flex-row overflow-hidden shadow-sm border border-gray-600',
        className
      )}
      ref={containerRef}
    >
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
            className={'absolute top-2 right-2 z-10'}
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
            onSuccess={f => {
              setSelectedFragmentId(f.id);
              setIsCreateModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className={'flex-grow grid place-items-center bg-gray-100'}>
        {fragments?.length === 0 && <CreateRegulationFragmentForm className={'size-full'} />}

        {selectedFragment && <pre>{JSON.stringify(selectedFragment, null, 2)}</pre>}
      </div>
    </div>
  );
}
