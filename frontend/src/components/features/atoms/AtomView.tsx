import { AtomDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { CSSProperties } from 'react';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';

interface AtomCardProps {
  atom: AtomDTO;
}

export function AtomView({ atom }: AtomCardProps) {
  const [, hover] = getHighlightColor(atom.id.toString());

  const [, setHoveredAtom] = useHoveredAtom();

  return (
    <div
      onMouseEnter={() => setHoveredAtom(atom.id)}
      onMouseLeave={() => setHoveredAtom(null)}
      className="border-l-6 p-2 hover:bg-gray-200 transition-colors border-l-[var(--border-color)] flex items-start"
      style={
        {
          '--border-color': hover,
        } as CSSProperties
      }
    >
      <h3 className="font-semibold text-base">{atom.predicate}</h3>
    </div>
  );
}
