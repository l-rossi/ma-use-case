import { parseAsInteger, useQueryState } from 'nuqs';
import { create } from 'zustand';

export function _useHoveredAtomOld() {
  return useQueryState('hovered-atom', parseAsInteger);
}

// Define the store interface
interface HoveredAtomState {
  hoveredAtom: number | null;
  setHoveredAtom: (atomId: number | null) => void;
}

// Create the store with state and actions
export const useHoveredAtomStore = create<HoveredAtomState>((set) => ({
  hoveredAtom: null,
  setHoveredAtom: (atomId) => set({ hoveredAtom: atomId }),
}));

// Hook that properly subscribes to state changes
export function useHoveredAtom() {
  // This will cause components to re-render when the state changes
  const hoveredAtom = useHoveredAtomStore((state) => state.hoveredAtom);
  const setHoveredAtom = useHoveredAtomStore((state) => state.setHoveredAtom);

  return [hoveredAtom, setHoveredAtom] as const;
}
