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

import { PropsWithChildren, forwardRef, ForwardedRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends PropsWithChildren {
  className?: string;
  title?: ReactNode;
}

export const Box = forwardRef<HTMLDivElement, Readonly<Props>>(
  ({ className, children, title }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-gray-50 shadow-sky-500 relative flex flex-col overflow-hidden shadow-md border border-gray-600',
          className
        )}
      >
        {!!title && <h3 className="text-lg font-semibold px-4 pt-4">{title}</h3>}

        {children}
      </div>
    );
  }
);
Box.displayName = 'Box';
