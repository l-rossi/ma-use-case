import { CreateChatMessageDTO, ChatMessageDTO } from '@dtos/dto-types';

/**
 * Get chat messages for a specific regulation
 * @param regulationId The ID of the regulation
 * @returns Promise with an array of ChatMessageDTO objects
 */
export async function getChatForRegulation(regulationId: string): Promise<Array<ChatMessageDTO>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulations/${regulationId}/chat`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch chat messages for regulation');
  }

  return await res.json();
}

/**
 * Create a new chat message for a regulation
 * @param regulationId The ID of the regulation
 * @param dto The CreateChatMessageDTO containing the message content
 * @returns Promise with the created ChatMessageDTO
 */
export async function createChatMessage(
  regulationId: number,
  dto: CreateChatMessageDTO
): Promise<ChatMessageDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulations/${regulationId}/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to create chat message');
  }

  return await res.json();
}
