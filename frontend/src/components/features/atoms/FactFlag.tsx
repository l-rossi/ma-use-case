import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  isFact?: boolean;
}

export function FactFlag(props: Readonly<Props>) {
  return (
    <span
      className={cn(
        'ml-2 text-xs px-1.5 py-0.5 rounded-full',
        props.isFact ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
        props.className
      )}
    >
      {props.isFact ? 'fact' : 'derived'}
    </span>
  );
}
