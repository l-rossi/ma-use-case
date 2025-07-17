import { parseAsInteger, useQueryState } from 'nuqs';

export function useHoveredAtom() {
  return useQueryState('hovered-atom', parseAsInteger);
}
