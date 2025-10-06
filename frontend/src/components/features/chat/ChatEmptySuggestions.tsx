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

'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from 'usehooks-ts';
import { RefObject, useRef } from 'react';

interface Props {
  disabled: boolean;
  onSelect: (text: string) => void;
  className?: string;
}

const SUGGESTIONS = [
  'Feedback the current formalism',
  'How can I simplify the knowledge base?',
  'Explain the rules',
];

export function ChatEmptySuggestions({ disabled, onSelect, className }: Readonly<Props>) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('flex flex-nowrap mx-4 gap-2', className)} ref={ref}>
      {SUGGESTIONS.map(text => (
        <SuggestionButton
          disabled={disabled}
          key={text}
          text={text}
          onSelect={onSelect}
          parent={ref}
        />
      ))}
    </div>
  );
}

export function SuggestionButton({
  text,
  onSelect,
  disabled,
  parent,
}: {
  parent: RefObject<HTMLDivElement | null>;
  text: string;
  disabled: boolean;
  onSelect: (text: string) => void;
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    root: parent.current,
    rootMargin: '0px',
    threshold: 1.0,
  });

  return (
    <Button
      disabled={disabled}
      ref={ref}
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        'rounded-full border-gray-300 text-gray-700 bg-white hover:bg-gray-100',
        !isIntersecting && 'invisible'
      )}
      onClick={() => onSelect(text)}
    >
      {text}
    </Button>
  );
}

export default ChatEmptySuggestions;
