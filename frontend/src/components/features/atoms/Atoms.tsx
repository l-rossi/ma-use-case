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
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { AtomDTO } from '@dtos/dto-types';
import { RegenerationForm } from './RegenerationForm';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { CreateAtomModal } from '@/components/features/atoms/CreateAtomModal';

interface Props {
  className?: string;
}

export function Atoms({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

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

  const feedbackTextRef = useRef<HTMLTextAreaElement>(null);
  const [feedbackFocused, setFeedbackFocused] = useState(false);
  const [feedback, setFeedback] = useState('');

  // const highlightedFeedback = useDeferredValue(highlightAtomsInFeedback(feedback, atoms));
  const [highlightedFeedback, setHighlightedFeedback] = useState<ReactNode>(null);
  useEffect(() => {
    if (!feedback) {
      setHighlightedFeedback(null);
      return;
    }
  }, [feedback]);

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
          className,
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
        <div className={"h-full overflow-hidden flex flex-col"}>
          <ul className="flex flex-col gap-3 overflow-y-auto">
            {atoms.map(atom => (
              <li key={atom.id}>
                <AtomView
                  atom={atom}
                  textarea={feedbackTextRef.current}
                  setFeedback={setFeedback}
                  feedbackFocused={feedbackFocused}
                />
              </li>
            ))}
          </ul>
          <CreateAtomModal regulationFragmentId={selectedFragmentId} />
        </div>

        <div className={'flex flex-col'}>
          <h3 className="text-lg font-semibold mb-2">Regenerate Atoms</h3>
          <RegenerationForm
            feedback={feedback}
            setFeedback={setFeedback}
            fragmentId={selectedFragmentId}
            onFocus={() => {
              setFeedbackFocused(true);
              setHighlightedFeedback(null);
            }}
            onBlur={() => {
              setFeedbackFocused(false);
              setHighlightedFeedback(
                highlightAtomsInFeedback(feedback, atoms, feedbackTextRef.current),
              );
            }}
            highlightedFeedback={highlightedFeedback}
            ref={feedbackTextRef}
          />
        </div>
      </div>
    </Box>
  );
}

function highlightAtomsInFeedback(
  feedback: string,
  atoms: AtomDTO[],
  textAreaRef: HTMLTextAreaElement | null,
): ReactNode {
  const escapedTokens = atoms.map(atom => atom.predicate.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const splitFeedback = feedback.split(regex);

  let textOffset = 0;
  return splitFeedback.map((part, index) => {
    // TODO, known limitation: This is purely orthographic matching. "Duplicate" predicates will not be highlighted correctly.
    const atom = atoms.find(atom => atom.predicate === part);
    textOffset += part.length;
    if (atom) {
      return (
        <InlineHighlight
          atomId={atom.id}
          text={atom.predicate}
          key={index}
          textAreaRef={textAreaRef}
          textOffset={textOffset}
        />
      );
    }
    return part;
  });
}

function InlineHighlight({
                           atomId,
                           text,
                           textAreaRef,
                           textOffset,
                         }: {
  atomId: number;
  text: string;
  textAreaRef: HTMLTextAreaElement | null;
  textOffset: number;
}) {
  const [hoveredAtom, setHoveredAtom] = useHoveredAtom();
  const [base, hover] = getHighlightColor(atomId.toString());
  const isSelected = hoveredAtom === atomId;

  return (
    <span
      style={
        {
          '--bg-base': isSelected ? hover : base,
          '--bg-hover': hover,
        } as CSSProperties
      }
      className={cn(
        'transition-colors hover:bg-[var(--bg-hover)] bg-[var(--bg-base)] duration-100 pointer-events-auto',
      )}
      onMouseEnter={() => setHoveredAtom(atomId)}
      onMouseLeave={() => setHoveredAtom(null)}
      // This is 100% not aria conform :DDDDD
      onClick={e => {
        if (!textAreaRef) return;
        textAreaRef.focus();
        textAreaRef.setSelectionRange(textOffset - text.length, textOffset);
      }}
    >
      {text}
    </span>
  );
}
