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

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  isFact?: boolean;
}

export function FactFlag(props: Readonly<Props>) {
  return (
    <span
      className={cn(
        'ml-2 text-xs px-1.5 py-0.5 rounded-full',
        props.isFact ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
        props.className
      )}
    >
      {props.isFact ? 'fact' : 'derived'}
    </span>
  );
}
