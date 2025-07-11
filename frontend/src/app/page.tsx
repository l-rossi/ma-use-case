import { RegulationFragmentsView } from '@/components/features/regulation-fragments/RegulationFragmentsView';

export default function Home() {
  return (
    <div className={'size-full grid grid-cols-10 grid-rows-5 gap-2'}>
      <RegulationFragmentsView className={'col-span-6 row-span-3'} />

      <div className={'bg-emerald-500 col-span-4 row-span-3'}>Agentic Stuff</div>

      <div className={'bg-rose-500 col-span-3 row-span-2'}>Formal Rules</div>

      <div className={'bg-sky-500 col-span-3 row-span-2'}>Atoms</div>

      <div className={'bg-violet-500 col-span-4 row-span-2'}>Chat</div>
    </div>
  );
}
