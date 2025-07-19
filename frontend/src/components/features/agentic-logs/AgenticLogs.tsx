'use client';

import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useAgenticLogs } from '@/hooks/useAgenticLogs';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { memo, useEffect, useRef, useState } from 'react';
import { CollapsibleText } from '@/components/ui/CollapsibleText';
import Markdown from 'react-markdown';
import { Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

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
  }, [lastLogId]);

  return (
    <Box className={cn('shadow-emerald-500 flex flex-col h-full', className)}>
      <div className="bg-gray-900 text-white p-2 font-mono flex justify-between items-center">
        <span className={'flex flex-row items-center gap-1'}>
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
        </span>
        {isFetching && <span className="text-xs text-gray-400">Fetching new logs...</span>}
      </div>

      <div
        className="flex-1 overflow-y-auto bg-gray-950 text-gray-50 p-4 font-mono text-sm"
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
              <div key={log.id} className="mb-2">
                <span className="text-gray-500">[{new Date(log.created_at).toISOString()}]</span>
                <span className="text-yellow-400 ml-2">[{log.message_source}]</span>
                <div>
                  {/*TODO show system prompt*/}
                  <CollapsibleText maxLines={10} className={'whitespace-pre-wrap list-disc'}>
                    <LogMessage content={log.user_prompt} />
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

const LogMessage = memo(function LogMessage({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        code: ({ node, className, children, ...props }) => (
          <code
            className={cn(
              'bg-gray-800 p-1 rounded-md overflow-y-auto mb-4',
              node?.properties?.className ? 'block' : 'inline',
              className
            )}
            {...props}
          >
            {children}
          </code>
        ),
        h1: ({ node, className, children, ...props }) => (
          <h1 className={cn('text-xl font-bold mb-2', className)} {...props}>
            {children}
          </h1>
        ),
        h2: ({ node, className, children, ...props }) => (
          <h2 className={cn('text-lg font-semibold mb-1', className)} {...props}>
            {children}
          </h2>
        ),
        p: ({ node, className, children, ...props }) => (
          <p className={cn('mb-2', className)} {...props}>
            {children}
          </p>
        ),
        ol: ({ node, className, children, ...props }) => (
          <ol className={cn('list-decimal pl-10 mb-2', className)} {...props}>
            {children}
          </ol>
        ),
        ul: ({ node, className, children, ...props }) => (
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

function messageSourceToTextColor(source: string): string {
  switch (source) {
    case 'USER':
      return 'text-blue-400';
    case 'MODEL':
      return 'text-green-400';
    case 'system':
      return 'text-gray-400';
    default:
      return 'text-yellow-400';
  }
}
