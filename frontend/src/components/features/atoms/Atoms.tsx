import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function Atoms({ className }: Readonly<Props>) {
  return <Box className={cn('shadow-sky-500', className)}>Atoms</Box>;
}
