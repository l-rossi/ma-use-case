import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function Rules({ className }: Readonly<Props>) {
  return (
    <Box className={cn(className, 'shadow-rose-500 p-4')}>
      <h3 className="text-lg font-semibold">Rules</h3>
    </Box>
  );
}
