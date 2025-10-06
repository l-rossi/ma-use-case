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

import { useAddExample, useExamples } from '@/hooks/useExamplesStore';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Example } from './Example';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { AutoGenerateExamplesButton } from './AutoGenerateExamplesButton';


export function Examples() {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const examples = useExamples(selectedFragmentId || -1);
  const addExample = useAddExample(selectedFragmentId);

  if (!selectedFragmentId) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Please select a regulation fragment to view examples.</p>
      </div>
    );
  }

  return (
    <Tabs className="w-full" defaultValue={examples.length > 0 ? examples[0].key : undefined}>
      <TabsList className="bg-transparent w-full flex justify-start mb-4 border-b border-gray-200">
        {examples.map((example, index) => (
          <TabsTrigger
            key={example.key}
            value={example.key}
            className={cn(
              'bg-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 relative w-fit grow-0',
              'data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent',
              'data-[state=active]:after:bg-gray-600 after:transition-colors'
            )}
          >
            Example {index + 1}
          </TabsTrigger>
        ))}

        <div className="ml-auto flex px-4">
          <AutoGenerateExamplesButton regulationFragmentId={selectedFragmentId} />
          <Button size={'sm'} onClick={() => addExample()}>
            <Plus className="mr-1" />
            Add
          </Button>
        </div>
      </TabsList>

      {examples.map(example => (
        <TabsContent key={example.key} value={example.key} className="mt-2 overflow-hidden">
          <Example example={example} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
