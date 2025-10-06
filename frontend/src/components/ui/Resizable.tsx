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

import * as React from 'react';
import { Expand, Grid3x2Icon, GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  );
}

function ResizablePanel({
  enableResizeButtons = true,
  fullscreen,
  reset,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel> & {
  fullscreen?: () => void;
  reset?: () => void;
  enableResizeButtons?: boolean;
}) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      {...props}
      className={cn('relative overflow-hidden @container', props.className)}
    >
      {props.children}
      {enableResizeButtons && (
        <>
          <Button
            className={'absolute top-4 right-4 text-gray-400 hidden @min-[70vw]:inline-flex'}
            variant={'ghost'}
            size={'icon'}
            onClick={() => reset?.()}
            title={'Reset'}
          >
            <Grid3x2Icon className={'size-4'} />
          </Button>
          <Button
            className={
              'absolute top-4 right-4 text-gray-400 hidden @max-[10vw]:hidden @max-[70vw]:inline-flex'
            }
            variant={'ghost'}
            size={'icon'}
            onClick={() => fullscreen?.()}
            title={'Fullscreen'}
          >
            <Expand className={'size-4'} />
          </Button>
        </>
      )}
    </ResizablePrimitive.Panel>
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
