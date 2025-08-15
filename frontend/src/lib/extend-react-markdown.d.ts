import { ReactNode } from 'react';
import { Components as OriginalComponents } from 'react-markdown';

declare module 'react-markdown' {
  export type Components = OriginalComponents & {
    suggestion: { target?: string; children?: ReactNode };
    explanation: { children?: ReactNode };
    action: { children?: ReactNode };
  };
}
