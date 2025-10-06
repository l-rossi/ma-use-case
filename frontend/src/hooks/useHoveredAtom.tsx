/*
Leveraging Legal Information Representation for Business Process Compliance  
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
