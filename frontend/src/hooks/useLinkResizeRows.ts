import { ImperativePanelHandle } from 'react-resizable-panels';
import { useRef } from 'react';

export function useLinkResizeRows() {
  const refs = useRef<(ImperativePanelHandle | null)[][]>([]);

  return (x: number, y: number) => {
    return {
      ref: (ref: ImperativePanelHandle | null) => {
        if (!refs.current[x]) {
          refs.current[x] = [];
        }
        refs.current[x][y] = ref;
      },
      onResize: (size: number) => {
        const column = refs.current[x];
        column.forEach((panel, index) => {
          if (panel && index !== y) {
            panel.resize(size);
          }
        });
      },
    };
  };
}
