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
