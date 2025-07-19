import { AtomDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { CSSProperties, MouseEventHandler } from 'react';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface AtomCardProps {
  atom: AtomDTO;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
}

export function AtomView({ atom, onClick, onMouseDown }: AtomCardProps) {
  const [, hover] = getHighlightColor(atom.id.toString());

  const [selectedAtom, setHoveredAtom] = useHoveredAtom();

  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      disabled={!onClick}
      onMouseEnter={() => setHoveredAtom(atom.id)}
      onMouseLeave={() => setHoveredAtom(null)}
      className={cn(
        'p-2 hover:bg-gray-200 transition-colors border-l-[var(--border-color)] flex justify-between items-center text-left',
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
      {onClick && <ArrowRight className="ml-2 h-4 w-4 text-gray-500" />}
    </button>
  );
}
