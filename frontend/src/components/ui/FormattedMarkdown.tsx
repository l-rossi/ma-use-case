'use client';

import { memo } from 'react';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { ChatAction, ChatExplanation, ChatSuggestion } from '@/components/ui/ChatSuggestion';
import { rehypeChatSuggestionPlugin } from '@/lib/rehype-chat-suggestions';

interface FormattedMarkdownProps {
  content: string;
  codeClassName?: string;
  renderChatSuggestions?: boolean;
}

// We are playing a bit fast and loose with the types here because I am too dumb to properly "extend" the components
// type definition from react-markdown here (Extending JSX.IntrinsicElement seems a bit too sketchy for my liking) :)
const componentExtension = {
  suggestion: ChatSuggestion,
  explanation: ChatExplanation,
  action: ChatAction,
};
/**
 * Formats markdown content with custom components for chat suggestions, explanations, and actions.
 *
 * @param {FormattedMarkdownProps} props - The properties for the component.
 * @param {string} props.content - The markdown content to format.
 * @param {string} [props.codeClassName] - Optional class name for code blocks.
 * @param {boolean} [props.renderChatSuggestions=false] - Whether render <suggestion> blocks (LLM chat suggestions).
 */
export const FormattedMarkdown = memo(function FormattedMarkdown({
  content,
  codeClassName,
  renderChatSuggestions = false,
}: FormattedMarkdownProps) {
  return (
    <Markdown
      rehypePlugins={renderChatSuggestions ? [rehypeChatSuggestionPlugin] : []}
      components={{
        ...(renderChatSuggestions ? componentExtension : {}),
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h1: ({ className, children, node: _, ...props }) => (
          <h1 className={cn('text-xl font-bold mb-2', className)} {...props}>
            {children}
          </h1>
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h2: ({ className, children, node: _, ...props }) => (
          <h2 className={cn('text-lg font-semibold mb-1', className)} {...props}>
            {children}
          </h2>
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        p: ({ className, children, node: _, ...props }) => (
          <p className={cn('mb-2', className)} {...props}>
            {children}
          </p>
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ol: ({ className, children, node: _, ...props }) => (
          <ol
            className={cn('list-decimal pl-8 break-words w-full overflow-hidden mb-2', className)}
            {...props}
          >
            {children}
          </ol>
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ul: ({ className, children, node: _, ...props }) => (
          <ul
            className={cn('list-disc pl-8 break-words w-full overflow-hidden mb-2', className)}
            {...props}
          >
            {children}
          </ul>
        ),
      }}
    >
      {/*Yes, one could try using a custom parser or some better output format. Or one could also just
      try and force the parser to render these tags as their own raw element using string replacement :DDDD*/}
      {content
        .replace(/<suggestion target="\w+">/g, it => `\n${it}\n`)
        .replace(/<\/suggestion>/g, it => `\n${it}\n`)
        .replace(/<\/?explanation>/g, it => `\n${it}\n`)
        .replace(/<\/?action>/g, it => `\n${it}\n`)}
    </Markdown>
  );
});
