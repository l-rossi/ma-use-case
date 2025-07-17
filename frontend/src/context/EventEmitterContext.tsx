import * as React from 'react';
import mitt from 'mitt';
import { Events } from '@/lib/events';

export const EventEmitterContext = React.createContext<ReturnType<typeof mitt<Events>> | null>(
  null
);

export function useEventEmitter() {
  const emitter = React.useContext(EventEmitterContext);
  if (!emitter) {
    throw new Error('useEventEmitter must be used within an EventEmitterProvider');
  }
  return emitter;
}

export function EventEmitterProvider({ children }: { children: React.ReactNode }) {
  const emitter = mitt<Events>();
  return <EventEmitterContext.Provider value={emitter}>{children}</EventEmitterContext.Provider>;
}
