/*
Leveraging Legal Information Representation for Business Process Compliance  
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { AtomDTO, RuleDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { cn, windowed } from '@/lib/utils';
import { CSSProperties } from 'react';
import { useAtoms } from '@/hooks/useAtoms';
import { InfoDialog } from '@/components/ui/InfoDialog';

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
      <div className="font-semibold text-base truncate whitespace-normal overflow-hidden text-ellipsis min-w-0 break-words w-full pr-2">
        <p>{head + HORN_TAIL_SEP}</p>
        {windowed(literals, 2, 2).map((it, index) => (
          <PredicateView key={it[0] + "-" + index} literal={it[0]!.trim()} separator={it[1]} atoms={atoms} />
        ))}
        .
      </div>
      <InfoDialog
        title={"Rule description"}
        description={rule.description || "No description available."}
        triggerClassName="shrink-0 ml-2"
      />
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
    <p className="pl-8 break-words overflow-hidden w-full">
      {/*<span*/}
      {/*// style={{ backgroundColor: highlightColor }}*/}
      {/*>*/}
        {literal}
        {separator}
      {/*</span>*/}
    </p>
  );
}

// function upToBracket(str: string) {
//   return str.slice(0, str.indexOf('(') + 1);
// }
