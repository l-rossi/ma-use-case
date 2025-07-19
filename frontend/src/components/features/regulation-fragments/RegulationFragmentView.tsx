import { AtomDTO, RegulationFragmentDTO } from '@dtos/dto-types';
import { CSSProperties, ReactNode } from 'react';
import { useAtoms } from '@/hooks/useAtoms';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { cn } from '@/lib/utils';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { modelNames } from '@/lib/modelNames';

interface Props {
  fragment: RegulationFragmentDTO;
}

export function RegulationFragmentView({ fragment }: Readonly<Props>) {
  const { data: atoms = [] } = useAtoms(fragment.id);

  return (
    <div className={'size-full p-4 flex flex-col items-start'}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className={'text-lg font-semibold'}>{fragment.title}</h3>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
          {modelNames[fragment.llm_identifier]}
        </span>
      </div>
      <hr />
      <p className={cn(!!atoms.length && 'leading-8')}>
        <HighlightedContent atoms={atoms} text={fragment.content} />
      </p>
    </div>
  );
}

interface HighlightedContentProps {
  atoms: Array<AtomDTO>;
  text: string;
}

function HighlightedContent({ atoms, text }: HighlightedContentProps) {
  // TODO no check for overlapping spans. Should not happen from how atoms are generated.
  const spans = atoms.flatMap(atom => atom.spans).sort((a, b) => a.start - b.start);

  const elements: Array<ReactNode> = [];

  let lastEnd = 0;
  for (const span of spans) {
    elements.push(text.slice(lastEnd, span.start));
    elements.push(
      <Highlight
        key={`${span.start}-${span.end}`}
        atomId={span.atom_id}
        text={text.slice(span.start, span.end)}
      />
    );
    lastEnd = span.end;
  }
  elements.push(text.slice(lastEnd));

  return elements;
}

interface HighlightProps {
  atomId: number;
  text: string;
}

function Highlight({ atomId, text }: HighlightProps) {
  const [base, hover] = getHighlightColor(atomId.toString());
  const [hoveredAtom, setHoveredAtom] = useHoveredAtom();
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
        'px-1 py-0.5 rounded-sm transition-colors hover:bg-[var(--bg-hover)] bg-[var(--bg-base)] border border-gray-400 duration-100'
      )}
      key={atomId}
      onMouseEnter={() => setHoveredAtom(atomId)}
      onMouseLeave={() => setHoveredAtom(null)}
    >
      {text}
    </span>
  );
}
