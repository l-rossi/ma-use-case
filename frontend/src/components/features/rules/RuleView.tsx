import { AtomDTO, RuleDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { cn, windowed } from '@/lib/utils';
import { CSSProperties } from 'react';
import { useAtoms } from '@/hooks/useAtoms';

interface Props {
  rule: RuleDTO;
}

const HORN_TAIL_SEP = ':-';
const LITERAL_SEP = /(\)[,;])/;

export function RuleView({ rule }: Readonly<Props>) {
  const [, hover] = getHighlightColor(rule.id.toString());

  const [head, tail] = rule.definition.split(HORN_TAIL_SEP);
  const literals = tail.replace(/.$/, '').split(LITERAL_SEP);

  const { data: atoms = [] } = useAtoms(rule.regulation_fragment_id);

  return (
    <li
      className={cn(
        'p-2 hover:bg-gray-200 transition-colors flex justify-between items-center text-left overflow-hidden',
        'active:bg-gray-200 border border-l-6',
        // selectedAtom === atom.id && 'border-gray-500',
        'hover:border-gray-500',
        'border-l-[var(--border-color)]',
        'hover:border-l-[var(--border-color)]'
      )}
      style={
        {
          '--border-color': hover,
        } as CSSProperties
      }
    >
      <h3 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
        <p>{head + HORN_TAIL_SEP}</p>
        {windowed(literals, 2, 2).map((it) => (
          <PredicateView key={it[0]} literal={it[0]!.trim()} separator={it[1]} atoms={atoms} />
        ))}
        .
      </h3>
    </li>
  );
}

interface LiteralViewProps {
  literal: string;
  separator: string | undefined;
  atoms: AtomDTO[];
}

function PredicateView({ literal, separator }: Readonly<LiteralViewProps>) {
  // const atom = atoms.find(a => upToBracket(a.predicate) === upToBracket(literal));
  // TODO maybe revisit this highlighting or get rid of it
  // const highlightColor = atom ? getHighlightColor(atom.id.toString())[0] : 'transparent';

  // console.log(atom);
  // console.log(atoms.map(it => upToBracket(it.predicate)));
  // console.log(upToBracket(literal));

  return (
    <p className="ml-8">
      <span
      // style={{ backgroundColor: highlightColor }}
      >
        {literal}
        {separator}
      </span>
    </p>
  );
}

// function upToBracket(str: string) {
//   return str.slice(0, str.indexOf('(') + 1);
// }
