import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function Chat({ className }: Readonly<Props>) {
  return <Box className={cn('shadow-violet-500', className)}>Chat</Box>;
}
