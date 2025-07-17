import { AtomDTO, RegulationFragmentDTO } from '@dtos/dto-types';
import { ReactNode } from 'react';
import { useAtoms } from '@/hooks/useAtoms';
import { getHighlightColor } from '@/lib/getHighlightColor';

interface Props {
  fragment: RegulationFragmentDTO;
}

export function RegulationFragmentView({ fragment }: Readonly<Props>) {
  const { data: atoms = [] } = useAtoms(fragment.id);

  return (
    <div className={'size-full p-4 flex flex-col items-start'}>
      <h3 className={'text-lg font-semibold mb-4'}>{fragment.title}</h3>
      <hr />
      <p>
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

  return (
    <span
      style={{
        '--bg-base': '#333',
        '--bg-hover': '#007bff',
      }}
      className={'px-1 py-0.5 rounded-md transition-colors hover:bg-[--bg-hover] bg-[--bg-base] border border-gray-600'}
      key={atomId}
    >
      {text}
    </span>
  );
}
