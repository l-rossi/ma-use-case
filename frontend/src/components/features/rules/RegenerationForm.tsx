'use client';

import { FormEvent, ForwardedRef, forwardRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { useRegenerateRules } from '@/hooks/useRegenerateRules';

interface RegenerationFormProps {
  fragmentId: number;
  onFocus?: () => void;
  onBlur?: () => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
}

export const RegenerationForm = forwardRef<HTMLTextAreaElement, Readonly<RegenerationFormProps>>(
  (
    { fragmentId, onFocus, onBlur, feedback, setFeedback },
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const regenerateRulesMutation = useRegenerateRules({
      fragmentId,
      feedback,
      onSuccess: () => setFeedback(''),
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      regenerateRulesMutation.mutate();
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-2 flex-grow">
          <label htmlFor="feedback" className="text-sm font-medium">
            Feedback
          </label>
          <Textarea
            id="feedback"
            placeholder="Provide feedback for rule regeneration..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            className="min-h-40 resize-none"
            required
            onFocus={onFocus}
            onBlur={onBlur}
            ref={ref}
          />
        </div>
        <Button
          className={'mt-auto'}
          type="submit"
          disabled={regenerateRulesMutation.isPending || !feedback.trim()}
        >
          <RefreshCw className="mr-2 size-4" />
          {regenerateRulesMutation.isPending ? 'Regenerating...' : 'Regenerate Rules'}
        </Button>
      </form>
    );
  }
);

RegenerationForm.displayName = 'RegenerationForm';
