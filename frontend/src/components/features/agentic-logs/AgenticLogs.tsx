import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function AgenticLogs({ className }: Readonly<Props>) {
  return (
    <Box className={cn('shadow-emerald-500 grid plaice-items-center', className)}>Agentic Logs</Box>
  );
}
