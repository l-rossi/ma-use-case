'use client';

import { parseAsInteger, useQueryState } from 'nuqs';

export function useSelectedRegulationFragmentId() {
  return useQueryState('selectedFragment', parseAsInteger);
}
