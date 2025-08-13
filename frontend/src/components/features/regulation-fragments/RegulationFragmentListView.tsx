'use client';

import { RegulationFragmentDTO } from '@dtos/dto-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRegulationFragment } from '@/components/features/regulation-fragments/regulation-fragments.api';
import { LoaderCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';

interface Props {
  fragment: RegulationFragmentDTO;
  onClick?: () => void;
}

export function RegulationFragmentListView({ fragment, onClick }: Readonly<Props>) {
  const queryClient = useQueryClient();
  const [, setSelectedFragmentId] = useSelectedRegulationFragmentId();
  const { mutate: deleteFragment, isPending } = useMutation({
    mutationFn: () => deleteRegulationFragment(fragment.id),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['regulation-fragments'],
      }),
    onSuccess: () => setSelectedFragmentId(null),
  });
  return (
    <div
      className={
        'w-full cursor-pointer border shadow text-neutral-800 bg-gray-50 flex flex-col p-3 rounded-md text-start hover:ring-gray-600 hover:ring transition-colors focus-visible:outline-none focus-visible:ring-2 my-1 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
      }
      onClick={onClick}
      role={'button'}
      tabIndex={0}
    >
      <div className={'flex flex-row items-center justify-between mb-1'}>
        <span className={'font-semibold '}>{fragment.title}</span>
        <Button
          variant={'ghost'}
          className={'p-1 cursor-pointer hover:bg-red-100 focus-visible:bg-red-100'}
          disabled={isPending}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            deleteFragment();
          }}
        >
          {isPending ? (
            <LoaderCircle className={'animate-spin size-3'} />
          ) : (
            <Trash className={'size-3 text-red-600'} />
          )}
        </Button>
      </div>

      <hr className={'my-1 border-neutral-400'} />
      <p className={'whitespace-pre-wrap overflow-hidden overflow-ellipsis line-clamp-3'}>
        {fragment.content}
      </p>
    </div>
  );
}
