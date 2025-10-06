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

import * as React from 'react';
import mitt from 'mitt';
import { Events } from '@/lib/events';

export const EventEmitterContext = React.createContext<ReturnType<typeof mitt<Events>> | null>(
  null
);

export function useEventEmitter() {
  const emitter = React.useContext(EventEmitterContext);
  if (!emitter) {
    throw new Error('useEventEmitter must be used within an EventEmitterProvider');
  }
  return emitter;
}

export function EventEmitterProvider({ children }: { children: React.ReactNode }) {
  const emitter = mitt<Events>();
  return <EventEmitterContext.Provider value={emitter}>{children}</EventEmitterContext.Provider>;
}
