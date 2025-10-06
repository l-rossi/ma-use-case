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

import { AtomDTO } from '@dtos/dto-types';
import { getHighlightColor } from '@/lib/getHighlightColor';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useDeleteAtom } from '@/hooks/useDeleteAtom';
import { AtomInfoModal } from './AtomInfoModal';
import { FactFlag } from '@/components/features/atoms/FactFlag';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';

interface AtomCardProps {
  atom: AtomDTO;
  feedbackFocused: boolean;
  textarea: HTMLTextAreaElement | null;
  setFeedback: Dispatch<SetStateAction<string>>;
}

export function AtomView({ atom, textarea, setFeedback, feedbackFocused }: AtomCardProps) {
  const [, hover] = getHighlightColor(atom.id.toString());
  const [selectedAtom, setHoveredAtom] = useHoveredAtom();

  const { mutate: deleteAtom, isPending, isError } = useDeleteAtom();

  if (!feedbackFocused) {
    return (
      <div
        onMouseEnter={() => setHoveredAtom(atom.id)}
        onMouseLeave={() => setHoveredAtom(null)}
        className={cn(
          'p-2 hover:bg-gray-200 transition-colors flex justify-between items-center text-left overflow-hidden',
          'active:bg-gray-200 border border-l-6',
          selectedAtom === atom.id && 'border-gray-500',
          ' border-l-[var(--border-color)]'
        )}
        style={
          {
            '--border-color': hover,
          } as CSSProperties
        }
      >
        <h3 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
          {atom.predicate}
        </h3>
        <FactFlag className={'mr-auto'} isFact={atom.is_fact} />
        <div className="flex items-center shrink-0">
          <AtomInfoModal atom={atom} />
          <ConfirmDeleteDialog
            title="Atom"
            description={`Are you sure you want to delete the atom "${atom.predicate}"?`}
            isPending={isPending}
            isError={isError}
            onDelete={() => deleteAtom(atom.id)}
            triggerClassName="ml-2"
            errorMessage="Failed to delete the atom. Please try again."
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (!textarea) return;
        textarea.focus();
        setFeedback(oldFeedback => {
          const textBefore = oldFeedback.substring(0, textarea.selectionStart);
          const textAfter = oldFeedback.substring(textarea.selectionEnd);
          return textBefore + atom.predicate + textAfter;
        });
      }}
      onMouseDown={e => e.preventDefault()}
      onMouseEnter={() => setHoveredAtom(atom.id)}
      onMouseLeave={() => setHoveredAtom(null)}
      className={cn(
        'p-2 hover:bg-gray-200 transition-colors border-l-[var(--border-color)] flex justify-between items-center text-left w-full',
        'active:bg-gray-200 border border-l-6',
        selectedAtom === atom.id && 'border-gray-500'
      )}
      style={
        {
          '--border-color': hover,
        } as CSSProperties
      }
    >
      <h3 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
        {atom.predicate}
      </h3>
      <FactFlag className={'mr-auto'} isFact={atom.is_fact} />
      <div className="flex items-center">
        <ArrowRight className="ml-2 size-4 text-gray-500" />
      </div>
    </button>
  );
}
