import { AtomDTO, RegulationFragmentDTO } from '@dtos/dto-types';
import { CSSProperties, ReactNode } from 'react';
import { useAtoms } from '@/hooks/useAtoms';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { cn } from '@/lib/utils';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { llmIdentifierToName } from '@/lib/enumToName';
import { PriceModal } from './PriceModal';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface Props {
  fragment: RegulationFragmentDTO;
}

export function RegulationFragmentView({ fragment }: Readonly<Props>) {
  const { data: atoms = [] } = useAtoms(fragment.id);

  return (
    <div className={'size-full py-4 flex flex-col items-start'}>
      <div className="flex items-center gap-2 mb-4">
        <h4 className={'text-lg font-medium'}>{fragment.title}</h4>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
          {llmIdentifierToName[fragment.llm_identifier]}
        </span>
        {!!fragment.source && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
            {fragment.source ? `${fragment.source}` : 'No source provided'}
          </span>
        )}
        <PriceModal fragmentId={fragment.id} />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Download formalism"
          title="Download formalism"
          asChild
        >
          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragment.id}/export`} download target="_blank">
            <Download className="size-4" />
          </a>
        </Button>
      </div>
      <hr />
      <p className={cn("whitespace-pre-wrap", !!atoms.length && 'leading-8')}>
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
