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

import { RegulationFragments } from '@/components/features/regulation-fragments/RegulationFragments';
import { AgenticLogs } from '@/components/features/agentic-logs/AgenticLogs';
import { Rules } from '@/components/features/rules/Rules';
import { Atoms } from '@/components/features/atoms/Atoms';
import { Explanations } from '@/components/features/explanation/Explanations';
import { Chat } from '@/components/features/chat/Chat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { useLinkResizeRows } from '@/hooks/useLinkResizeRows';

export default function Home() {
  const { registerCell, registerRow } = useLinkResizeRows();

  return (
    <ResizablePanelGroup direction="vertical" className="size-full">
      <ResizablePanel{...registerRow(0, 50)}>
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel {...registerCell(0, 0, 40)} className={'p-2'}>
            <RegulationFragments className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...registerCell(1, 0, 40)} className={'p-2'}>
            <Explanations className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...registerCell(2, 0, 20)} className={'p-2'}>
            <AgenticLogs className={'size-full'} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle className={'bg-gray-700'} />

      <ResizablePanel {...registerRow(1, 50)}>
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel {...registerCell(0, 1, 40)} className={'p-2'}>
            <Atoms />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...registerCell(1, 1, 40)} className={'p-2'}>
            <Rules className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...registerCell(2, 1, 20)} className={'p-2'}>
            <Chat className={'size-full'} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
