import { AtomDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useDeleteAtom } from '@/hooks/useDeleteAtom';
import { AtomInfoModal } from './AtomInfoModal';
import { FactFlag } from '@/components/features/atoms/FactFlag';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';

interface AtomCardProps {
  atom: AtomDTO;
  feedbackFocused: boolean;
  textarea: HTMLTextAreaElement | null;
  setFeedback: Dispatch<SetStateAction<string>>;
}

export function AtomView({ atom, textarea, setFeedback, feedbackFocused }: AtomCardProps) {
  const [, hover] = getHighlightColor(atom.id.toString());
  const [selectedAtom, setHoveredAtom] = useHoveredAtom();

  const { mutate: deleteAtom, isPending, isError } = useDeleteAtom();

  if (!feedbackFocused) {
    return (
      <div
        onMouseEnter={() => setHoveredAtom(atom.id)}
        onMouseLeave={() => setHoveredAtom(null)}
        className={cn(
          'p-2 hover:bg-gray-200 transition-colors flex justify-between items-center text-left overflow-hidden',
          'active:bg-gray-200 border border-l-6',
          selectedAtom === atom.id && 'border-gray-500',
          ' border-l-[var(--border-color)]'
        )}
        style={
          {
            '--border-color': hover,
          } as CSSProperties
        }
      >
        <h3 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
          {atom.predicate}
        </h3>
        <FactFlag className={'mr-auto'} isFact={atom.is_fact} />
        <div className="flex items-center shrink-0">
          <AtomInfoModal atom={atom} />
          <ConfirmDeleteDialog
            title="Atom"
            description={`Are you sure you want to delete the atom "${atom.predicate}"?`}
            isPending={isPending}
            isError={isError}
            onDelete={() => deleteAtom(atom.id)}
            triggerClassName="ml-2"
            errorMessage="Failed to delete the atom. Please try again."
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (!textarea) return;
        textarea.focus();
        setFeedback(oldFeedback => {
          const textBefore = oldFeedback.substring(0, textarea.selectionStart);
          const textAfter = oldFeedback.substring(textarea.selectionEnd);
          return textBefore + atom.predicate + textAfter;
        });
      }}
      onMouseDown={e => e.preventDefault()}
      onMouseEnter={() => setHoveredAtom(atom.id)}
      onMouseLeave={() => setHoveredAtom(null)}
      className={cn(
        'p-2 hover:bg-gray-200 transition-colors border-l-[var(--border-color)] flex justify-between items-center text-left w-full',
        'active:bg-gray-200 border border-l-6',
        selectedAtom === atom.id && 'border-gray-500'
      )}
      style={
        {
          '--border-color': hover,
        } as CSSProperties
      }
    >
      <h3 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
        {atom.predicate}
      </h3>
      <FactFlag className={'mr-auto'} isFact={atom.is_fact} />
      <div className="flex items-center">
        <ArrowRight className="ml-2 size-4 text-gray-500" />
      </div>
    </button>
  );
}
