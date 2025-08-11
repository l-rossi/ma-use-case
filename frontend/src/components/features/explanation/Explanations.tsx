import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { GraphVisualization } from './GraphVisualization';
import { Examples } from './Examples';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useRules } from '@/hooks/useRules';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface Props {
  className?: string;
}

export function Explanations({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const {
    data: atoms = [],
    isPending: atomsPending,
    isError: atomsError,
    refetch: refetchAtoms
  } = useAtoms(selectedFragmentId);

  const {
    data: rules = [],
    isPending: rulesPending,
    isError: rulesError,
    refetch: refetchRules
  } = useRules(selectedFragmentId);

  const isPending = atomsPending || rulesPending;
  const isError = atomsError || rulesError;
  const isEmpty = atoms.length === 0 || rules.length === 0;

  if (!selectedFragmentId) {
    return (
      <Box className={cn('shadow-fuchsia-500 flex items-center justify-center p-4', className)}>
        Please select a regulation fragment first
      </Box>
    );
  }

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError) {
    return (
      <Box
        className={cn(
          'text-red-500 shadow-fuchsia-500 p-4 flex flex-col items-center justify-center',
          className,
        )}
      >
        <p className="mb-4">Failed to load atoms or rules.</p>
        <Button 
          variant={'outline'} 
          type={'button'} 
          size={'lg'} 
          onClick={() => {
            refetchAtoms();
            refetchRules();
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // If there are no atoms or rules
  if (isEmpty) {
    return (
      <Box
        className={cn('shadow-fuchsia-500 p-4 flex flex-col items-center justify-center', className)}
      >
        <p className="mb-4">
          {atoms.length === 0 && rules.length === 0
            ? "No atoms and rules found for this fragment"
            : atoms.length === 0
            ? "No atoms found for this fragment"
            : "No rules found for this fragment"}
        </p>
        <p className="text-gray-500 mb-4">
          Generate atoms and rules first to see explanations
        </p>
      </Box>
    );
  }

  // Normal rendering with data
  return (
    <Box className={cn(className, 'shadow-fuchsia-500 flex flex-col')}>
      <h3 className="text-lg font-semibold p-4 ">Explanations</h3>
        <Tabs defaultValue="graph" className={"size-full overflow-hidden"}>
          <TabsList className={"mx-4 gap-1"}>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className={"size-full flex"}>
            <GraphVisualization className="size-full" />
          </TabsContent>
          <TabsContent value="examples" className={"size-full flex overflow-hidden"}>
            <Examples className="size-full" />
          </TabsContent>
        </Tabs>
    </Box>
  );
}
