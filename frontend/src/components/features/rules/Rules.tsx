import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function Rules({ className }: Readonly<Props>) {
  return <Box className={cn(className, 'shadow-rose-500')}>Rules</Box>;
}
