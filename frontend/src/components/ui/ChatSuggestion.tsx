'use client';
/**
 * Custom components to be injected into the markdown for the Chat to allow "actions" to be displayed.
 */

import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { Button } from './Button';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useRegenerateAtoms } from '@/hooks/useRegenerateAtoms';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useRegenerateRules } from '@/hooks/useRegenerateRules';

interface ChatSuggestionProps {
  children?: ReactNode;
  target: string;
}

export function ChatSuggestion({ target, children }: Readonly<ChatSuggestionProps>) {
  if (target !== 'atoms' && target !== 'rules') {
    return (
      <span className={'text-red-900'}>
        Invalid suggestion (The LLM provided an invalid target: {target}).
      </span>
    );
  }

  return <ChatSuggestionContext value={{ target }}>{children}</ChatSuggestionContext>;
}

export function ChatExplanation({ children }: Readonly<PropsWithChildren>) {
  return children;
}

interface ChatActionProps {
  children: ReactNode;
  text: string;
}

export function ChatAction({ children, text }: Readonly<ChatActionProps>) {
  const { target } = useChatSuggestionContext();
  const [fragmentId] = useSelectedRegulationFragmentId();

  const trimmedText = text
    .replace(/^<action>/, '')
    .replace(/<\/action>$/, '')
    .trim();

  const regenerateAtoms = useRegenerateAtoms({
    fragmentId: fragmentId!,
    feedback: trimmedText,
  });
  const regenerateRules = useRegenerateRules({
    fragmentId: fragmentId!,
    feedback: trimmedText,
  });

  const isPending = target === 'atoms' ? regenerateAtoms.isPending : regenerateRules.isPending;
  const isSuccess = target === 'atoms' ? regenerateAtoms.isSuccess : regenerateRules.isSuccess;

  return (
    <div className={'flex flex-col items-start gap-2 overflow-hidden max-w-full my-4'}>
      <div className={'bg-gray-200 rounded-sm break-words whitespace-normal w-full px-2 py-1 flex flex-col'}>{children}</div>

      {isSuccess ? (
        <span className={'py-1 px-2 rounded text-green-500 bg-green-50 border border-green-500'}>
          Feedback applied
        </span>
      ) : (
        <Button
          size={'sm'}
          disabled={isPending}
          onClick={() => {
            if (target === 'atoms') {
              regenerateAtoms.mutate();
            } else if (target === 'rules') {
              regenerateRules.mutate();
            }
          }}
        >
          {isPending ? (
            <LoaderCircle className={'animate-spin size-3'} />
          ) : (
            <Sparkles className={'mr-1 size-4'} />
          )}
          Run
        </Button>
      )}
    </div>
  );
}

type ChatSuggestionContextType = {
  target: 'atoms' | 'rules';
};

const ChatSuggestionContext = createContext<ChatSuggestionContextType | null>(null);

export function useChatSuggestionContext() {
  const ctx = useContext(ChatSuggestionContext);
  if (!ctx) {
    throw new Error('useChatSuggestionContext must be used within a ChatSuggestionProvider');
  }
  return ctx;
}
