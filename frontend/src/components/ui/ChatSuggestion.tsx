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
