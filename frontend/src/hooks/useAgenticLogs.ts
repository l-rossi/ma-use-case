'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getAgenticLogs } from '@/components/features/agentic-logs/agentic_logs.api';
import { AgenticLogDTO } from '@dtos/dto-types';
import { useEffect } from 'react';

type PageParam = {
  cursor: number;
  direction: 'asc' | 'desc';
};

/**
 * Hook to fetch agentic logs for a specific fragment ID with efficient real-time updates
 * @param fragmentId The ID of the regulation fragment
 * @returns Infinite query result with agentic logs data, loading and error states
 */
export function useAgenticLogs(fragmentId: number | null) {
  const LIMIT = 20;

  const queryClient = useQueryClient();
  const queryKeyOld = ['agentic-logs', fragmentId];

  const query = useInfiniteQuery<Array<AgenticLogDTO>>({
    initialPageParam: undefined as PageParam | undefined,
    queryKey: queryKeyOld,
    queryFn: ({ pageParam }) => {
      const castPageParam = pageParam as PageParam | undefined;
      const usedDirection = castPageParam?.direction ?? 'desc';
      return getAgenticLogs(fragmentId!, castPageParam?.cursor, usedDirection, LIMIT).then(data =>
        usedDirection === 'asc' ? data : data.reverse()
      );
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const lastLog = lastPage[lastPage.length - 1];
      // If there is no last log we just reuse the page param for next time
      return lastLog ? { cursor: lastLog.id, direction: 'asc' } : lastPageParam;
    },
    getPreviousPageParam: firstPage => {
      const firstLog = firstPage[0];
      return firstLog ? { cursor: firstLog.id, direction: 'desc' } : undefined;
    },
    select: data => {
      // Remove empty pages whilst keeping the "page params up to date"
      const newPages: (typeof data)['pages'] = [];
      const newPageParams: (typeof data)['pageParams'] = [];

      data.pages.forEach((item, index) => {
        if (item.length > 0) {
          newPages.push(item);
          newPageParams.push(data.pageParams[index]);
        }
      });

      return {
        pages: newPages,
        pageParams: newPageParams,
      };
    },
    enabled: !!fragmentId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Automatically refetch new logs every 5 seconds
    const interval = setInterval(() => {
      if (query.isFetching || !fragmentId) return;
      if (query.data?.pages?.length === 0) {
        queryClient.invalidateQueries({ queryKey: queryKeyOld });
      } else {
        query.fetchNextPage();
      }
    }, 5000);

    return () => clearInterval(interval);
  });

  return query;
}
