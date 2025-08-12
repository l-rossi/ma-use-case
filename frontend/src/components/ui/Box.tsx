import { PropsWithChildren, forwardRef, ForwardedRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends PropsWithChildren {
  className?: string;
  title?: ReactNode;
}

export const Box = forwardRef<HTMLDivElement, Readonly<Props>>(
  ({ className, children, title }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-gray-50 shadow-sky-500 relative flex flex-col overflow-hidden shadow-md border border-gray-600',
          className
        )}
      >
        {!!title && <h3 className="text-lg font-semibold px-4 pt-4">{title}</h3>}

        {children}
      </div>
    );
  }
);
Box.displayName = 'Box';
