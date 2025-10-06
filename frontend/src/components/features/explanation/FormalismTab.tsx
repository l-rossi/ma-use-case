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
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFormalism } from './explanation.api';

interface Props {
  regulationFragmentId: number;
}

export function FormalismTab({ regulationFragmentId }: Readonly<Props>) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['regulation-fragments', regulationFragmentId, 'formalism'],
    queryFn: () => getFormalism(regulationFragmentId),
    enabled: !!regulationFragmentId,
  });

  const formalism = data?.text;

  if (isLoading) {
    return <div className="p-4">Loading formalism...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'Failed to load formalism. Please try again.'}
      </div>
    );
  }

  if (!formalism) {
    return <div className="p-4">No formalism available for this regulation fragment.</div>;
  }

  return (
    <div className="p-4 overflow-hidden flex flex-col w-full">
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Download formalism"
          title="Download formalism"
          asChild
        >
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/formalism/download`}
            download
            target="_blank"
          >
            <Download className="size-4" />
          </a>
        </Button>
      </div>

      <div className="text-black whitespace-pre-wrap font-mono overflow-y-auto h-full">
        {formalism}
      </div>
    </div>
  );
}
