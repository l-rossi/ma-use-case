import { ImperativePanelHandle } from 'react-resizable-panels';
import { useRef } from 'react';

interface Handle extends ImperativePanelHandle {
  reset?: () => void;
}

export function useLinkResizeRows() {
  const cellRefs = useRef<(Handle | null)[][]>([]);
  const rowRefs = useRef<(Handle | null)[]>([]);

  return {
    registerRow: (row: number, defaultSize: number) => {
      return {
        defaultSize: defaultSize,
        ref: (ref: Handle | null) => {
          if (ref) {
            ref.reset = () => ref?.resize(defaultSize);
          }
          rowRefs.current[row] = ref;
        },
        enableResizeButtons: false,
      };
    },
    registerCell: (x: number, y: number, defaultSize: number) => {
      return {
        defaultSize: defaultSize,
        enableResizeButtons: true,
        fullscreen: () => {
          console.log(`Fullscreen cell at (${x}, ${y})`);
          rowRefs.current.forEach((panel, index) => {
            panel?.resize(0);
          });
          cellRefs.current.flat().forEach(panel => {
            panel?.resize(0);
          });
          rowRefs.current[y]?.resize(100);
          cellRefs.current[x][y]?.resize(100);
        },
        reset: () => {
          rowRefs.current.forEach(panel => {
            panel?.reset?.();
          });
          cellRefs.current.flat().forEach(panel => {
            panel?.reset?.();
          });
        },
        ref: (ref: Handle | null) => {
          if (!cellRefs.current[x]) {
            cellRefs.current[x] = [];
          }
          if (ref) {
            ref.reset = () => ref?.resize(defaultSize);
          }
          cellRefs.current[x][y] = ref;
        },
        onResize: (size: number) => {
          const column = cellRefs.current[x];
          column.forEach((panel, index) => {
            if (panel && index !== y) {
              panel.resize(size);
            }
          });
        },
      };
    },
  };
}
