import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';

interface Props {
  className?: string;
}

export function Explanations({ className }: Readonly<Props>) {
  return (
    <Box className={cn(className, 'shadow-fuchsia-500 p-4')}>
      <h3 className="text-lg font-semibold">Explanations</h3>
    </Box>
  );
}
