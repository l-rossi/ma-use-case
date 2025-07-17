import { useEffect } from 'react';
import { useEventEmitter } from '@/context/EventEmitterContext';
import { Handler } from 'mitt';
import { Events } from '@/lib/events';

export function useMittEventListener<E extends keyof Events = keyof Events>(
  event: E,
  handler: Handler<Events[E]>
) {
  const emitter = useEventEmitter();

  // Yes, this remounts on every render if the handler is not memoized. I do not care.
  useEffect(() => {
    emitter.on(event, handler);
    return () => {
      emitter.off(event, handler);
    };
  }, [emitter, event, handler]);
}
