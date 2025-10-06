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

'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, Suspense } from 'react';
import { QueryClient } from '@tanstack/query-core';
import { EventEmitterProvider } from '@/context/EventEmitterContext';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  const queryClient = getQueryClient();

  return (
    <EventEmitterProvider>
      <Suspense>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </NuqsAdapter>
      </Suspense>
    </EventEmitterProvider>
  );
}
