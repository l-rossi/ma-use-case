'use client';

import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useAgenticLogs } from '@/hooks/useAgenticLogs';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useEffect, useRef, useState } from 'react';
import { CollapsibleText } from '@/components/ui/CollapsibleText';
import { CircleAlert, Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface Props {
  className?: string;
}

export function AgenticLogs({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const {
    isFetching,
    isPending,
    error,
    data,
    isFetchingPreviousPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useAgenticLogs(selectedFragmentId);
  const logs = data?.pages.flat() ?? [];

  const [shouldFollow, setShouldFollow] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const lastLogId = logs[logs.length - 1]?.id;
  const previousLastLogId = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (previousLastLogId.current === lastLogId) return;

    previousLastLogId.current = lastLogId;

    if (!containerRef.current) return;

    if (shouldFollow) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    // Yes, these are some wild dependencies, but we want to only trigger scrolls when the
    // number of logs changes, not when the toggle is clicked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLogId]);

  return (
    <Box className={cn(className, 'shadow-emerald-500 flex flex-col h-full')}>
      <div className="bg-gray-900 text-white p-2 font-mono flex justify-between items-center">
        <div className={'flex flex-row items-center gap-1'}>
          Agentic Logs
          <Button
            size={'icon'}
            onClick={() => setShouldFollow(b => !b)}
            variant={'ghost'}
            title={'Toggle follow logs'}
            className={' hover:bg-gray-500 hover:text-gray-100'}
          >
            {shouldFollow ? <Lock /> : <LockOpen />}
          </Button>
          {logs.at(-1)?.is_error && <CircleAlert className={'ml-auto text-red-800 size-4'} />}
        </div>
        {isFetching && <span className="text-xs text-gray-400 mr-10">Fetching new logs...</span>}
      </div>

      <div
        className="flex-1 overflow-y-auto bg-gray-950 text-gray-50 p-4 pl-2 font-mono text-sm"
        ref={containerRef}
        onScroll={e => {
          if (e.currentTarget.scrollTop < 20 && !isFetchingPreviousPage) {
            fetchPreviousPage();
          }
        }}
      >
        {selectedFragmentId === null ? (
          <div>Create or Select a fragment to continue</div>
        ) : isPending ? (
          <div>Loading logs...</div>
        ) : error ? (
          <div className="text-red-500">Error loading logs: {(error as Error).message}</div>
        ) : logs?.length === 0 ? (
          <div>No logs available</div>
        ) : (
          <div className="flex flex-col">
            {hasPreviousPage && <Skeleton className={'w-full h-20'} />}

            {logs?.map(log => (
              <div
                key={log.id}
                className={cn('mb-2 pl-2 border-l-2 border-l-transparent', cn(log.is_error && 'border-l-red-500'))}
              >
                <span className="text-gray-500">[{new Date(log.created_at).toISOString()}]</span>
                <span className="text-yellow-400 ml-2">[{log.message_source}]</span>
                <div>
                  {/*TODO show system prompt*/}
                  <CollapsibleText maxLines={10} className={'whitespace-pre-wrap list-disc'}>
                    <FormattedMarkdown content={log.user_prompt} />
                  </CollapsibleText>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}

