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
  const register = useLinkResizeRows();

  return (
    <ResizablePanelGroup direction="vertical" className="size-full">
      <ResizablePanel>
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel {...register(0, 0)} className={'p-2'} defaultSize={40}>
            <RegulationFragments className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...register(1, 0)} className={'p-2'} defaultSize={40}>
            <Explanations className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...register(2, 0)} className={'p-2'} defaultSize={20}>
            <AgenticLogs className={'size-full'} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle className={'bg-gray-700'} />

      <ResizablePanel>
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel {...register(0, 1)} className={'p-2'} defaultSize={40}>
            <Atoms className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...register(1, 1)} className={'p-2'} defaultSize={40}>
            <Rules className={'size-full'} />
          </ResizablePanel>

          <ResizableHandle className={'bg-gray-700'} />

          <ResizablePanel {...register(2, 1)} className={'p-2'} defaultSize={20}>
            <Chat className={'size-full'} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
