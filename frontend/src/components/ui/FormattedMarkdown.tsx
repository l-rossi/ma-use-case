'use client';

import { memo } from 'react';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface FormattedMarkdownProps {
  content: string;
  codeClassName?: string;
}

export const FormattedMarkdown = memo(function FormattedMarkdown({ content, codeClassName }: FormattedMarkdownProps) {
  return (
    <Markdown
      components={{
        code: ({ node, className, children, ...props }) => (
          <code
            className={cn(
              'bg-gray-800 p-1 rounded-md overflow-y-auto mb-4',
              node?.properties?.className ? 'block' : 'inline',
              className,
              codeClassName
            )}
            {...props}
          >
            {children}
          </code>
        ),
        h1: ({ className, children, ...props }) => (
          <h1 className={cn('text-xl font-bold mb-2', className)} {...props}>
            {children}
          </h1>
        ),
        h2: ({ className, children, ...props }) => (
          <h2 className={cn('text-lg font-semibold mb-1', className)} {...props}>
            {children}
          </h2>
        ),
        p: ({ className, children, ...props }) => (
          <p className={cn('mb-2', className)} {...props}>
            {children}
          </p>
        ),
        ol: ({ className, children, ...props }) => (
          <ol className={cn('list-decimal pl-10 mb-2', className)} {...props}>
            {children}
          </ol>
        ),
        ul: ({ className, children, ...props }) => (
          <ul className={cn('list-disc pl-10 mb-2', className)} {...props}>
            {children}
          </ul>
        ),
      }}
    >
      {content}
    </Markdown>
  );
});