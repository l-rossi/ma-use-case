import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface PrologAtom {
  id: string;
  value: string;
}

export interface PrologFact {
  id: string;
  predicateId: number;
  // Variable (literal) to atom ID mapping
  prologAtoms: Record<string, string>;
}

interface ExamplesStateEntry {
  prologAtoms: PrologAtom[];
  prologFacts: PrologFact[];
  addPrologAtom: (value: string) => PrologAtom;
  removePrologAtom: (atomId: string) => void;
  addFact: (predicateId: number) => PrologFact;
  removeFact: (factId: string) => void;
  setAtomIdForFact: (factId: string, atomId: string | null, variable: string) => void;
}

type ExamplesState = {
  data: Record<number, ExamplesStateEntry>;
  get: (fragmentId: number) => ExamplesStateEntry;
  reset: (fragmentId: number) => void;
};

const useExampleSture = create<ExamplesState>()(
  immer((set, getState) => ({
    data: {},
    reset: (fragmentId: number) =>
      set(state => {
        delete state.data[fragmentId];
      }),
    get: fragmentId => {
      const state = getState();
      const entry = state.data[fragmentId];
      if (entry) {
        return entry;
      }

      const newEntry: ExamplesStateEntry = {
        prologAtoms: [],
        prologFacts: [],
        addPrologAtom: (value: string) => {
          const newAtom = {
            id: Date.now().toString(),
            value,
          };
          set(state => {
            state.data[fragmentId].prologAtoms.push(newAtom);
          });
          return newAtom;
        },
        removePrologAtom: (atomId: string) => {
          set(state => {
            state.data[fragmentId].prologAtoms = state.data[fragmentId].prologAtoms.filter(
              atom => atom.id !== atomId
            );
          });
        },
        addFact: (predicateId: number) => {
          const newFact = {
            id: Date.now().toString(),
            predicateId,
            prologAtoms: {},
          };
          set(state => {
            state.data[fragmentId].prologFacts.push(newFact);
          });
          return newFact;
        },
        removeFact: (factId: string) => {
          set(state => {
            state.data[fragmentId].prologFacts = state.data[fragmentId].prologFacts.filter(
              fact => fact.id !== factId
            );
          });
        },
        setAtomIdForFact: (factId, atomId, variable) => {
          set(state => {
            const fact = state.data[fragmentId].prologFacts.find(f => f.id === factId);
            if (fact) {
              if (atomId === null) {
                delete fact.prologAtoms[variable];
              } else {
                fact.prologAtoms[variable] = atomId;
              }
            }
          });
        },
      };
      set(state => {
        state.data[fragmentId] = newEntry;
      });
      return newEntry;
    },
  }))
);

export function useExamples(fragmentId: number): ExamplesStateEntry {
  const state = useExampleSture(state => state);
  return state.get(fragmentId);
}

export function useResetExamples(fragmentId: number | null): () => void {
  if (fragmentId === null) {
    return () => {};
  }

  const reset = useExampleSture(state => state.reset);
  return () => reset(fragmentId);
}
