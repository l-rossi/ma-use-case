import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PrologAtom, PrologFact } from '@/hooks/useExamplesStore2';
import { AtomDTO } from '@dtos/dto-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function windowed<T>(
  array: Array<T>,
  size: number,
  step: number = 1
): Array<Array<T | undefined>> {
  const result = [];
  for (let i = 0; i <= array.length; i += step) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const variableRegex = /(?<!')\b(?:[A-Z]\w*|_[A-Za-z0-9]\w*)\b/g;

/**
 * A rough hack to get the unique variables in a Prolog statement.
 * This kind of just ignores literals in the form of strings:
 * 'I am a Literal ''Var'' but I am not detected as a variable'.
 * This is good enough for me as the alternative is building a proper parser.
 */
export function countUniqueVariables(predicate: string): number {
  return new Set(predicate.match(variableRegex) ?? []).size;
}

export function insertAtomsIntoVariables(
  predicates: AtomDTO[],
  prologAtoms: PrologAtom[],
  fact: PrologFact
): string {
  const predicate = predicates.find(a => a.id === fact.predicateId)!.predicate;
  return (
    predicate.replace(variableRegex, match => {
      const atomId = fact.prologAtoms[match];
      if (!atomId) {
        console.warn(`No atom assigned for variable ${match} in fact ${fact.id}`);
        return '_' + match;
      }
      const atom = prologAtoms.find(a => a.id === atomId);
      if (!atom) {
        console.warn(`No atom found for id ${atomId} in fact ${fact.id}`);
        return '_' + match;
      }
      return atom.value;
    }) + '.'
  );
}
