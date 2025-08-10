import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { GraphVisualization } from './GraphVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface Props {
  className?: string;
}

export function Explanations({ className }: Readonly<Props>) {
  return (
    <Box className={cn(className, 'shadow-fuchsia-500 flex flex-col')}>
      <h3 className="text-lg font-semibold p-4 ">Explanations</h3>
        <Tabs defaultValue="graph" className={"size-full"}>
          <TabsList className={"mx-4 gap-1"}>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className={"size-full flex"}>
            <GraphVisualization className="size-full" />
          </TabsContent>
        </Tabs>
    </Box>
  );
}
