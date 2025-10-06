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
