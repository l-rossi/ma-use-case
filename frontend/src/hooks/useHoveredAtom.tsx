import { create } from 'zustand';

interface HoveredAtomState {
  hoveredAtom: number | null;
  setHoveredAtom: (atomId: number | null) => void;
}

export const useHoveredAtomStore = create<HoveredAtomState>(set => ({
  hoveredAtom: null,
  setHoveredAtom: atomId => set({ hoveredAtom: atomId }),
}));

export function useHoveredAtom() {
  const hoveredAtom = useHoveredAtomStore(state => state.hoveredAtom);
  const setHoveredAtom = useHoveredAtomStore(state => state.setHoveredAtom);

  return [hoveredAtom, setHoveredAtom] as const;
}
