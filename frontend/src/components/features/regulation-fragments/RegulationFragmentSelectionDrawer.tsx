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

import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer';
import { RegulationFragmentListView } from '@/components/features/regulation-fragments/RegulationFragmentListView';
import { RegulationFragmentDTO } from '@dtos/dto-types';
import { cn } from '@/lib/utils';
import { useScrolledTo } from '@/hooks/useScrolledTo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/Input';

interface Props {
  fragments: Array<RegulationFragmentDTO>;
  container: {
    current: HTMLDivElement | null;
  };
  onSelect: (id: number) => void;
}

export function RegulationFragmentSelectionDrawer({
  fragments,
  container,
  onSelect,
}: Readonly<Props>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const { ref, isScrolledToBottom } = useScrolledTo();

  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withOptions({
      throttleMs: 300,
    })
  );
  const deferredQuery = useDeferredValue(query);
  const filteredFragments = useMemo(() => {
    if (!deferredQuery) {
      return fragments;
    }
    return fragments.filter(fragment =>
      fragment.title.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery, fragments]);

  return (
    <Drawer
      direction={'left'}
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      container={container.current}
    >
      <div className="h-full w-12 shadow-gray-700 flex flex-col items-center p-2 bg-gray-800">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-gray-200 ">
            <Menu />
          </Button>
        </DrawerTrigger>

        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent
            className={
              'absolute inset-0 bg-neutral-100 border-none flex flex-col overflow-hidden h-full'
            }
          >
            <DrawerHeader className={'flex flex-row justify-between'}>
              <DrawerTitle className={'text-neutral-800'}>Regulations</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="size-8 text-neutral-800 ">
                  <X />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <VisuallyHidden>
              <DrawerDescription>
                Select a regulation fragment from the list below.
              </DrawerDescription>
            </VisuallyHidden>

            <Input
              placeholder={'Search'}
              className={'mx-1 shrink-0 w-auto'}
              onChange={e => setQuery(e.target.value)}
              value={query ?? ''}
              type={'text'}
            />

            <DrawerFooter className={'overflow-hidden relative px-0 mt-0 mb-auto '}>
              <div className={'size-full overflow-y-auto border-gray-600 border-t'} ref={ref}>
                <ul className={'flex flex-col h-full bg-neutral-200'}>
                  {filteredFragments?.map(it => (
                    <li key={it.id} className={'w-full border-b border-gray-600  p-1'}>
                      <RegulationFragmentListView
                        fragment={it}
                        onClick={() => {
                          setIsDrawerOpen(false);
                          onSelect(it.id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 [background:linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_20%)]',
                  isScrolledToBottom && 'animate-fade-out opacity-0'
                )}
              />
            </DrawerFooter>
          </DrawerContent>
        </DrawerPortal>
      </div>
    </Drawer>
  );
}
