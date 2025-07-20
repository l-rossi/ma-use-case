import { useQuery } from '@tanstack/react-query';
import { getChatForRegulation } from '@/components/features/chat/chat.api';
import { ChatMessageDTO } from '../../generated/dto-types';

/**
 * Hook to fetch chat messages for a specific regulation
 * @param regulationId The ID of the regulation
 * @returns Query result with chat messages
 */
export function useChat(regulationId: number | null) {
  return useQuery<Array<ChatMessageDTO>>({
    queryKey: ['chat', regulationId],
    queryFn: () => {
      if (!regulationId) {
        return Promise.resolve([]);
      }
      return getChatForRegulation(regulationId.toString());
    },
    enabled: !!regulationId,
  });
}