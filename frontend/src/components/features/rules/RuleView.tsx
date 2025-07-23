import { RuleDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface Props {
  rule: RuleDTO;
}

const HORN_TAIL_SEP = ':-';
const LITERAL_SEP = '),';

export function RuleView({ rule }: Readonly<Props>) {
  const [, hover] = getHighlightColor(rule.id.toString());

  const [head, tail] = rule.definition.split(HORN_TAIL_SEP);
  const literals = tail.replace(/.$/, '').split(LITERAL_SEP);

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
        {/*{rule.definition}*/}
        <p>{head + HORN_TAIL_SEP}</p>
        {literals.map((it, index) => (
          <p key={it} className="ml-8">
            {it + (index === literals.length - 1 ? '' : LITERAL_SEP)}
          </p>
        ))}
        .
      </h3>
    </li>
  );
}
