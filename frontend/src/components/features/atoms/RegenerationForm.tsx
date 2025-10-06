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

import { FormEvent, ForwardedRef, forwardRef, ReactNode } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useRegenerateAtoms } from '@/hooks/useRegenerateAtoms';

interface RegenerationFormProps {
  fragmentId: number;
  onFocus?: () => void;
  onBlur?: () => void;
  feedback: string;
  highlightedFeedback: ReactNode;
  setFeedback: (feedback: string) => void;
}

export const RegenerationForm = forwardRef<HTMLTextAreaElement, Readonly<RegenerationFormProps>>(
  (
    { fragmentId, onFocus, onBlur, feedback, setFeedback, highlightedFeedback },
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const regenerateAtomsMutation = useRegenerateAtoms({
      fragmentId,
      feedback,
      onSuccess: () => setFeedback(''),
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      regenerateAtomsMutation.mutate();
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-2 flex-grow">
          <label htmlFor="feedback" className="text-sm font-medium">
            Feedback
          </label>
          <div className={'relative'}>
            <Textarea
              id="feedback"
              placeholder="Provide feedback for atom regeneration..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="min-h-40 resize-none"
              required
              onFocus={onFocus}
              onBlur={onBlur}
              ref={ref}
            />
            <div
              aria-hidden="true"
              className={cn(
                'rounded-md border border-transparent px-3 py-2 text-base md:text-sm whitespace-pre-wrap break-words',
                'absolute inset-0 pointer-events-none'
              )}
            >
              {highlightedFeedback}
            </div>
          </div>
        </div>
        <Button
          className={'mt-auto'}
          type="submit"
          disabled={regenerateAtomsMutation.isPending || !feedback.trim()}
        >
          <RefreshCw className="mr-2 size-4" />
          {regenerateAtomsMutation.isPending ? 'Regenerating...' : 'Regenerate Atoms'}
        </Button>
      </form>
    );
  }
);

RegenerationForm.displayName = 'RegenerationForm';
