'use client';

import { FormEvent, ForwardedRef, forwardRef, ReactNode } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateAtomsForFragment } from './atoms.api';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

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
    const queryClient = useQueryClient();

    const regenerateAtomsMutation = useMutation({
      mutationFn: () => regenerateAtomsForFragment(fragmentId, { feedback }),
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: ['atoms', fragmentId],
        }),
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
              onMouseEnter={() => console.log('Hi')}
              aria-hidden="true"
              className={cn(
                'rounded-md border border-transparent px-3 py-2 text-base md:text-sm whitespace-pre-wrap',
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
