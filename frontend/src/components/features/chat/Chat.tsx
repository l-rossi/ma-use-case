'use client';

import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useChat } from '@/hooks/useChat';
import { FormEvent, Fragment, useRef, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { createChatMessage } from './chat.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChatMessageDTO } from '@dtos/dto-types';
import { SendIcon, Loader2Icon } from 'lucide-react';
import { Message } from '@/components/features/chat/Message';
import { getDay } from 'date-fns';
import { InfoDialog } from '@/components/ui/InfoDialog';

interface Props {
  className?: string;
}

function ChatBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Box className={cn('shadow-violet-500 flex-col h-full', className)}>
      <div className="flex justify items-center mb-2 gap-1 p-4 pb-0">
        <h3 className="text-lg font-semibold">Chat</h3>
        <InfoDialog
          title={'Chat'}
          description={
            'Chat allows you to interact with the system and ask questions about the regulation fragments.'
          }
        />
      </div>
      {children}
    </Box>
  );
}

export function Chat({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const { data: messages = [], isPending, isError, refetch } = useChat(selectedFragmentId);
  const [newMessage, setNewMessage] = useState('');
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const queryClient = useQueryClient();
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => createChatMessage(selectedFragmentId!, { content }),
    onMutate: async content => {
      await queryClient.cancelQueries({ queryKey: ['chat', selectedFragmentId] });
      const previousMessages = queryClient.getQueryData<Array<ChatMessageDTO>>([
        'chat',
        selectedFragmentId,
      ]);
      if (previousMessages) {
        queryClient.setQueryData<Array<ChatMessageDTO>>(
          ['chat', selectedFragmentId],
          [
            {
              id: Date.now(),
              created_at: new Date().toISOString(),
              content: content,
              agent: 'USER',
            },
            ...previousMessages,
          ]
        );
      }
      return { previousMessages };
    },
    onError: (_err, _content, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['chat', selectedFragmentId], context.previousMessages);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['chat', selectedFragmentId],
      }),
    onSuccess: () =>
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      }),
  });

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFragmentId) return;

    sendMessageMutation.mutate(newMessage);
    setNewMessage('');
  };

  if (!selectedFragmentId) {
    return (
      <ChatBox className={className}>
        <div className={'flex flex-col items-center justify-center size-full text-center'}>
          Please select a fragment first
        </div>
      </ChatBox>
    );
  }

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError) {
    return (
      <ChatBox className={className}>
        <div className={'flex flex-col items-center justify-center size-full text-red-500'}>
          <p className="mb-4">Failed to load chat messages.</p>
          <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </ChatBox>
    );
  }

  return (
    <ChatBox className={className}>
      <ul
        className="flex-1 overflow-y-auto mb-4 gap-2 flex flex-col-reverse p-4 pt-0"
        ref={scrollContainerRef}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mb-auto mt-12">No messages yet.</p>
        ) : (
          messages.map((message, index) => (
            <Fragment key={message.id}>
              <Message message={message} />
              {(index === messages.length - 1 ||
                getDay(message.created_at) !== getDay(messages[index + 1]?.created_at)) && (
                <span className="px-4 py-1 bg-gray-200 rounded-full text-sm text-gray-600 mx-auto">
                  {new Date(message.created_at).toLocaleDateString(['de'], {
                    year: 'numeric',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              )}
            </Fragment>
          ))
        )}
      </ul>

      <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none overflow-y-auto h-24"
          disabled={sendMessageMutation.isPending}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </form>
    </ChatBox>
  );
}
