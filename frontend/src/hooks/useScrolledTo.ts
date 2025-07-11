'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export function useScrolledTo() {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const THRESHOLD = 1;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - THRESHOLD);
    setIsScrolledToTop(scrollTop <= THRESHOLD);
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current) return;

    const abortController = new AbortController();
    ref.current.addEventListener(
      'scroll',
      e => {
        const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
        setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - THRESHOLD);
        setIsScrolledToTop(scrollTop <= THRESHOLD);
      },
      {
        signal: abortController.signal,
      }
    );

    return () => abortController.abort();
  }, [ref.current]);

  return useMemo(
    () => ({
      ref,
      isScrolledToBottom,
      isScrolledToTop,
    }),
    [ref, isScrolledToBottom, isScrolledToTop]
  );
}
