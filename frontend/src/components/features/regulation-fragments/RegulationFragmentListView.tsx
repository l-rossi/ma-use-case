'use client';

import { RegulationFragmentDTO } from '../../../../generated/types';

interface Props {
  fragment: RegulationFragmentDTO;
  onClick?: () => void;
}

export function RegulationFragmentListView({ fragment, onClick }: Readonly<Props>) {
  return (
    <button
      className={
        'w-full border text-neutral-800  flex flex-col p-3 rounded-md text-start hover:ring-gray-600 hover:ring transition-colors focus-visible:outline-none focus-visible:ring-2 my-1 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
      }
      type={'button'}
      onClick={onClick}
    >
      <span className={'font-semibold '}>{fragment.title}</span>
      <hr className={'my-1 border-neutral-400'} />
      <p className={'whitespace-pre-wrap overflow-hidden overflow-ellipsis'}>
        {fragment.content.slice(0, 100)}...
      </p>
    </button>
  );
}
