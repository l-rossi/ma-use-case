'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CSSProperties, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxLines?: number;
  expandText?: string;
  collapseText?: string;
}

export function CollapsibleText({
  children,
  maxLines = 3,
  expandText = '...',
  collapseText = 'Show less',
  className,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowTrigger, setShouldShowTrigger] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Check if the text has more than maxLines
  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.scrollHeight;
      const lines = Math.ceil(height / lineHeight);

      setShouldShowTrigger(lines > maxLines);
    }
  }, [children, maxLines]);

  return (
    <div className={cn('w-full relative', className)} {...props}>
      <div
        ref={textRef}
        style={
          {
            '--line-clamp': !isOpen && shouldShowTrigger ? maxLines : undefined,
          } as CSSProperties
        }
        className={'line-clamp-[var(--line-clamp)]'}
      >
        {children}
      </div>

      {shouldShowTrigger && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer text-sm border hover:bg-gray-800 py-0.5 px-1 rounded-sm"
          type="button"
        >
          {isOpen ? collapseText : expandText}
        </button>
      )}
    </div>
  );
}
