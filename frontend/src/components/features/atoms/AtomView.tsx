import { AtomDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { cn } from '@/lib/utils';
import { ArrowRight, LoaderCircle, Trash2, CircleX } from 'lucide-react';
import { useDeleteAtom } from '@/hooks/useDeleteAtom';

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
          'p-2 hover:bg-gray-200 transition-colors flex justify-between items-center text-left',
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
        <h3 className="font-semibold text-base">{atom.predicate}</h3>
        <button
          onClick={() => deleteAtom(atom.id)}
          className="ml-2 p-1 hover:bg-gray-300 rounded"
          title="Delete atom"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className={'animate-spin size-4'} />
          ) : isError ? (
            <CircleX className={'size-4 text-red-500'} />
          ) : (
            <Trash2 className="size-4 text-red-500" />
          )}
        </button>
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
      <h3 className="font-semibold text-base">{atom.predicate}</h3>
      <div className="flex items-center">
        <ArrowRight className="ml-2 size-4 text-gray-500" />
      </div>
    </button>
  );
}
