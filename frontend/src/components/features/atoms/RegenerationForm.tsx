'use client';

import { FormEvent, useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateAtomsForFragment } from './atoms.api';

interface RegenerationFormProps {
  fragmentId: number;
}

export function RegenerationForm({ fragmentId }: Readonly<RegenerationFormProps>) {
  const [feedback, setFeedback] = useState('');
  const queryClient = useQueryClient();

  const regenerateAtomsMutation = useMutation({
    mutationFn: () => regenerateAtomsForFragment(fragmentId, feedback),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="feedback" className="text-sm font-medium">
          Feedback
        </label>
        <Textarea
          id="feedback"
          placeholder="Provide feedback for atom regeneration..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          className="min-h-[150px]"
          required
        />
      </div>
      <Button type="submit" disabled={regenerateAtomsMutation.isPending || !feedback.trim()}>
        {regenerateAtomsMutation.isPending ? 'Regenerating...' : 'Regenerate Atoms'}
      </Button>
    </form>
  );
}
