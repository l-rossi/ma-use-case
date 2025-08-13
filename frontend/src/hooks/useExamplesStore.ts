'use client';

import { create } from 'zustand';

export interface PrologAtom {
  id: string;
  value: string;
  unaryPredicates: number[];
}

interface ExamplesState {
  atomValuesByFragmentId: Record<number, PrologAtom[]>;
  setAtomValues: (fragmentId: number, atomValues: PrologAtom[]) => void;
  addAtomValue: (fragmentId: number, value: string) => void;
  removeAtomValue: (fragmentId: number, prologAtomId: string) => void;
  togglePredicate: (fragmentId: number, prologAtomId: string, predicateId: number) => void;
}

export const useExamplesStore = create<ExamplesState>(set => ({
  atomValuesByFragmentId: {},

  setAtomValues: (fragmentId, atomValues) =>
    set(state => ({
      atomValuesByFragmentId: {
        ...state.atomValuesByFragmentId,
        [fragmentId]: atomValues,
      },
    })),

  addAtomValue: (fragmentId, value) =>
    set(state => {
      const newAtom: PrologAtom = {
        id: Date.now().toString(),
        value,
        unaryPredicates: [],
      };
      return {
        atomValuesByFragmentId: {
          ...state.atomValuesByFragmentId,
          [fragmentId]: [...(state.atomValuesByFragmentId[fragmentId] || []), newAtom],
        },
      };
    }),

  removeAtomValue: (fragmentId, prologAtomId) =>
    set(state => ({
      atomValuesByFragmentId: {
        ...state.atomValuesByFragmentId,
        [fragmentId]: state.atomValuesByFragmentId[fragmentId].filter(
          atom => atom.id !== prologAtomId
        ),
      },
    })),

  togglePredicate: (fragmentId, prologAtomId, predicateId) =>
    set(state => {
      const atomValues = state.atomValuesByFragmentId[fragmentId] || [];

      return {
        atomValuesByFragmentId: {
          ...state.atomValuesByFragmentId,
          [fragmentId]: atomValues.map(a => {
            if (a.id !== prologAtomId) return a;

            let newPredicates: number[];
            if (a.unaryPredicates.includes(predicateId)) {
              newPredicates = a.unaryPredicates.filter(id => id !== predicateId);
            } else {
              newPredicates = [...a.unaryPredicates, predicateId];
            }

            return {
              ...a,
              unaryPredicates: newPredicates,
            };
          }),
        },
      };
    }),
}));

export function useExamples(fragmentId: number) {
  // Yes, I am a zustand Noob, please don't judge this mess too harshly <3
  const state = useExamplesStore(state => state);
  return {
    atomValues: state.atomValuesByFragmentId[fragmentId] || [],
    setAtomValues: (atomValues: PrologAtom[]) => state.setAtomValues(fragmentId, atomValues),
    addAtomValue: (value: string) => state.addAtomValue(fragmentId, value),
    removeAtomValue: (prologAtomId: string) => state.removeAtomValue(fragmentId, prologAtomId),
    togglePredicate: (prologAtomId: string, predicateId: number) =>
      state.togglePredicate(fragmentId, prologAtomId, predicateId),
  };
}
