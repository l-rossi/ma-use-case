import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AtomDTO, Example } from '@dtos/dto-types';
import { persist } from 'zustand/middleware';

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

export interface ExamplesStateEntry {
  prologAtoms: PrologAtom[];
  prologFacts: PrologFact[];
  // unique id
  key: string;
  description?: string;
  addPrologAtom: (value: string) => PrologAtom;
  removePrologAtom: (atomId: string) => void;
  addFact: (predicateId: number) => PrologFact;
  removeFact: (factId: string) => void;
  setAtomIdForFact: (factId: string, atomId: string | null, variable: string) => void;
}

type ExamplesState = {
  data: Record<number, ExamplesStateEntry[]>;
  get: (fragmentId: number) => ExamplesStateEntry[];
  addEmpty: (fragmentId: number) => void;
  addGenerated: (fragmentId: number, example: Example, predicates: AtomDTO[]) => void;
  remove: (fragmentId: number, key: string) => void;
  reset: (fragmentId: number) => void;
};

type SetFn<T> = (typeof useExampleStore<T>)['setState'];

function emptyEntry(fragmentId: number, set: SetFn<ExamplesState>): ExamplesStateEntry {
  const newEntry: ExamplesStateEntry = {
    prologAtoms: [],
    prologFacts: [],
    key: crypto.randomUUID(),
    addPrologAtom: (value: string) => {
      const newAtom = {
        id: crypto.randomUUID(),
        value,
      };
      set(state => {
        state.data[fragmentId].find(it => it.key === newEntry.key)?.prologAtoms.push(newAtom);
      });
      return newAtom;
    },
    removePrologAtom: (atomId: string) => {
      set(state => {
        state.data[fragmentId].find(it => it.key === newEntry.key)!.prologAtoms = state.data[
          fragmentId
        ]
          .find(it => it.key === newEntry.key)!
          .prologAtoms.filter(atom => atom.id !== atomId);
      });
    },
    addFact: (predicateId: number) => {
      const newFact = {
        id: crypto.randomUUID(),
        predicateId,
        prologAtoms: {},
      };
      set(state => {
        state.data[fragmentId].find(it => it.key === newEntry.key)!.prologFacts.push(newFact);
      });
      return newFact;
    },
    removeFact: (factId: string) => {
      set(state => {
        state.data[fragmentId].find(it => it.key === newEntry.key)!.prologFacts = state.data[
          fragmentId
        ]
          .find(it => it.key === newEntry.key)!
          .prologFacts.filter(fact => fact.id !== factId);
      });
    },
    setAtomIdForFact: (factId, atomId, variable) => {
      set(state => {
        const fact = state.data[fragmentId]
          .find(it => it.key === newEntry.key)!
          .prologFacts.find(f => f.id === factId);
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
  return newEntry;
}

const useExampleStore = create<ExamplesState>()(
  immer(
    persist(
      (set, getState) => ({
        data: {},
        reset: (fragmentId: number) =>
          set(state => {
            delete state.data[fragmentId];
          }),
        addGenerated: (fragmentId, example, predicates: AtomDTO[]) =>
          set(state => {
            // Warning: horrible code incoming :)
            const newEntry: ExamplesStateEntry = emptyEntry(fragmentId, set);
            newEntry.description = example.description;
            const atomValues = Array.from(
              new Set(
                example.facts
                  ?.flatMap(fact => fact.arguments?.map(arg => arg.value))
                  .filter(arg => arg !== undefined) || []
              )
            );
            const atoms = Object.fromEntries(
              atomValues.map(value => [
                value,
                {
                  id: crypto.randomUUID(),
                  value,
                },
              ])
            );

            const facts =
              example.facts
                ?.map(fact => {
                  const predicate = predicates.find(p => p.predicate === fact.predicate);
                  if (!predicate) {
                    console.warn(`Predicate not found for fact: ${fact.predicate}`);
                    return null;
                  }
                  return {
                    id: crypto.randomUUID(),
                    predicateId: predicate.id,
                    prologAtoms: Object.fromEntries(
                      fact.arguments?.map(arg => [arg.variable, atoms[arg.value]!.id]) ?? []
                    ),
                  } satisfies PrologFact;
                })
                .filter(it => it !== null && it !== undefined) ?? [];

            newEntry.prologAtoms = Object.values(atoms);
            newEntry.prologFacts = facts;
            state.data[fragmentId].push(newEntry);
          }),
        addEmpty: fragmentId =>
          set(state => {
            const newEntry: ExamplesStateEntry = emptyEntry(fragmentId, set);
            state.data[fragmentId].push(newEntry);
          }),
        remove: (fragmentId, key) =>
          set(state => {
            state.data[fragmentId] = state.data[fragmentId].filter(entry => entry.key !== key);
          }),
        get: fragmentId => {
          const state = getState();
          const entry = state.data[fragmentId];
          if (entry) {
            return entry;
          }

          const newEntry: ExamplesStateEntry[] = [];
          set(state => {
            state.data[fragmentId] = newEntry;
          });
          return newEntry;
        },
      }),
      {
        name: 'examples-store',
        // partialize: state => {
        //   // Only persist the data, not the functions
        //   return { data: state.data };
        // },
      }
    )
  )
);

export function useExamples(fragmentId: number): ExamplesStateEntry[] {
  const state = useExampleStore(state => state);
  return state.get(fragmentId);
}

export function useAddExample(fragmentId: number | null): () => void {
  const add = useExampleStore(state => state.addEmpty);
  if (fragmentId === null) {
    return () => {};
  }
  return () => add(fragmentId);
}

export function useAddGenerated(
  fragmentId: number | null
): (example: Example, predicates: AtomDTO[]) => void {
  const addGenerated = useExampleStore(state => state.addGenerated);
  if (fragmentId === null) {
    return () => {};
  }
  return (example: Example, predicates: AtomDTO[]) => addGenerated(fragmentId, example, predicates);
}

export function useRemoveExample(fragmentId: number | null): (key: string) => void {
  const remove = useExampleStore(state => state.remove);
  if (fragmentId === null) {
    return () => {};
  }
  return (key: string) => remove(fragmentId, key);
}

export function useResetExamples(fragmentId: number | null): () => void {
  const reset = useExampleStore(state => state.reset);
  if (fragmentId === null) {
    return () => {};
  }
  return () => reset(fragmentId);
}
