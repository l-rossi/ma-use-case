import { PropsWithChildren, forwardRef, ForwardedRef } from 'react';
import { cn } from '@/lib/utils';

interface Props extends PropsWithChildren {
  className?: string;
}

export const Box = forwardRef<HTMLDivElement, Readonly<Props>>(
  ({ className, children }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-gray-50 shadow-sky-500 relative flex flex-row overflow-hidden shadow-md border border-gray-600',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Box.displayName = 'Box';
