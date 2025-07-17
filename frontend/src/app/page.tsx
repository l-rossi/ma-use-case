import { RegulationFragments } from '@/components/features/regulation-fragments/RegulationFragments';
import { AgenticLogs } from '@/components/features/agentic-logs/AgenticLogs';
import { Rules } from '@/components/features/rules/Rules';
import { Atoms } from '@/components/features/atoms/Atoms';
import { Chat } from '@/components/features/chat/Chat';

export default function Home() {
  return (
    <div className={'size-full grid grid-cols-10 grid-rows-4 gap-2'}>
      <RegulationFragments className={'col-span-6 row-span-2'} />

      <AgenticLogs className={'col-span-4 row-span-2'} />

      <Rules className={'col-span-5 row-span-2'} />

      <Atoms className={'col-span-5 row-span-2'} />

      {/*<Chat className={'col-span-2 row-span-2'} />*/}
    </div>
  );
}
