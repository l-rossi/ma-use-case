import { Button } from '@/components/ui/Button';
import { useAddGenerated } from '@/hooks/useExamplesStore';
import { useAtoms } from '@/hooks/useAtoms';
import { generateExamples } from './explanation.api';
import { Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
  regulationFragmentId: number | null;
}

export function AutoGenerateExamplesButton({ regulationFragmentId }: Readonly<Props>) {
  const addGenerated = useAddGenerated(regulationFragmentId);
  const { data: atoms } = useAtoms(regulationFragmentId);
  const { mutate, isPending } = useMutation({
    mutationFn: () => generateExamples(regulationFragmentId!),
    onSuccess: examples => {
      examples.examples?.forEach(example => {
        addGenerated(example, atoms!);
      });
      toast.success(`Successfully generated examples.`);
    },
    onError: () => {
      toast.error('Examples could not be generated. Please consult the logs.');
    },
  });

  if (!regulationFragmentId || !atoms) {
    return null;
  }

  return (
    <Button size="sm" onClick={() => mutate()} disabled={isPending || !atoms} className="mr-2">
      <Sparkles className="mr-1 h-4 w-4" />
      {isPending ? 'Generating...' : 'Auto-generate examples'}
    </Button>
  );
}
