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
    <Tabs className="w-full">
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
