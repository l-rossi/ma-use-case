import { AgenticLogDTO } from '@dtos/dto-types';

/**
 * Get agentic logs for a specific regulation fragment with cursor-based pagination
 * @param fragmentId The ID of the regulation fragment
 * @param cursor Optional cursor for pagination (ID of the last log in previous batch)
 * @param order
 * @param limit Maximum number of logs to fetch
 * @returns Promise with an array of AgenticLogDTO objects
 */
export async function getAgenticLogs(
  fragmentId: number,
  cursor?: number,
  order: 'asc' | 'desc' = 'desc',
  limit: number = 20
): Promise<Array<AgenticLogDTO>> {
  const queryParams = new URLSearchParams();

  if (cursor) {
    queryParams.append('cursor', cursor.toString());
  }

  if (limit) {
    queryParams.append('limit', limit.toString());
  }

  queryParams.append('order-date', order);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/agentic-logs${queryString}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch agentic logs');
  }

  return await res.json();
}

/**
 * Get only new agentic logs since a specific timestamp
 * This uses the existing endpoint but with a small limit to efficiently fetch only new logs
 * @param fragmentId The ID of the regulation fragment
 * @param sinceTimestamp Optional timestamp to fetch logs after
 * @param limit Maximum number of logs to fetch
 * @returns Promise with an array of AgenticLogDTO objects
 */
export async function getNewAgenticLogs(
  fragmentId: number,
  sinceTimestamp?: string,
  limit: number = 5
): Promise<Array<AgenticLogDTO>> {
  const queryParams = new URLSearchParams();

  // We use a small limit to efficiently fetch only the newest logs
  queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${fragmentId}/agentic-logs${queryString}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch new agentic logs');
  }

  const logs = await res.json();

  // If we have a timestamp, filter logs to only include those after the timestamp
  if (sinceTimestamp) {
    return logs.filter((log: AgenticLogDTO) => new Date(log.created_at) > new Date(sinceTimestamp));
  }

  return logs;
}
