import { RegulationFragments } from '@/components/features/regulation-fragments/RegulationFragments';
import { AgenticLogs } from '@/components/features/agentic-logs/AgenticLogs';
import { Rules } from '@/components/features/rules/Rules';
import { Atoms } from '@/components/features/atoms/Atoms';
import { Chat } from '@/components/features/chat/Chat';

export default function Home() {
  return (
    <div className={'size-full grid grid-cols-10 grid-rows-5 gap-2'}>
      <RegulationFragments className={'col-span-6 row-span-3'} />

      <AgenticLogs className={'col-span-4 row-span-3'} />

      <Rules className={'col-span-3 row-span-2'} />

      <Atoms className={'col-span-3 row-span-2'} />

      <Chat className={'col-span-4 row-span-2'} />
    </div>
  );
}
