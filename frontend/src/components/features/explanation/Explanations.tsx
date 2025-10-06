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

import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { GraphVisualization } from './GraphVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useRules } from '@/hooks/useRules';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { InfoDialog } from '@/components/ui/InfoDialog';
import { ReactNode } from 'react';
import { Examples } from '@/components/features/explanation/Examples';
import { FormalismTab } from '@/components/features/explanation/FormalismTab';

interface Props {
  className?: string;
}

function ExplanationBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Box className={cn('shadow-fuchsia-500 flex-col overflow-hidden size-full', className)}>
      <div className="flex justify items-center mb-2 gap-1 p-4 pb-0">
        <h3 className="text-lg font-semibold">Explanations</h3>
        <InfoDialog
          title={'Explanations'}
          description={
            'Explanations provide insights into the formalized knowledge through examples and visualizations.'
          }
        />
      </div>
      {children}
    </Box>
  );
}

export function Explanations({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const {
    data: atoms = [],
    isPending: atomsPending,
    isError: atomsError,
    refetch: refetchAtoms,
  } = useAtoms(selectedFragmentId);

  const {
    data: rules = [],
    isPending: rulesPending,
    isError: rulesError,
    refetch: refetchRules,
  } = useRules(selectedFragmentId);

  const isPending = atomsPending || rulesPending;
  const isError = atomsError || rulesError;
  const isEmpty = atoms.length === 0 || rules.length === 0;

  if (!selectedFragmentId) {
    return (
      <ExplanationBox className={className}>
        <div className={'flex flex-col items-center justify-center size-full'}>
          Please select a regulation fragment first
        </div>
      </ExplanationBox>
    );
  }

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError) {
    return (
      <ExplanationBox className={className}>
        <div className={'flex flex-col items-center justify-center size-full text-red-500'}>
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
        </div>
      </ExplanationBox>
    );
  }

  if (isEmpty) {
    return (
      <ExplanationBox className={className}>
        <div className={'flex flex-col items-center justify-center size-full'}>
          <p className="mb-4">
            {atoms.length === 0 && rules.length === 0
              ? 'No atoms and rules found for this fragment'
              : atoms.length === 0
                ? 'No atoms found for this fragment'
                : 'No rules found for this fragment'}
          </p>
          <p className="text-gray-500 mb-4">Generate atoms and rules first to see explanations</p>
        </div>
      </ExplanationBox>
    );
  }

  return (
    <ExplanationBox className={className}>
      <Tabs defaultValue="examples" className={'size-full overflow-hidden'}>
        <TabsList className={'mx-4 gap-1'}>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="formalism">Formalism</TabsTrigger>
        </TabsList>
        <TabsContent value="graph" className={'size-full flex'}>
          <GraphVisualization className="size-full" />
        </TabsContent>
        <TabsContent value="examples" className={'size-full flex overflow-hidden'}>
          <Examples />
        </TabsContent>
        <TabsContent value="formalism" className={'size-full flex overflow-hidden'}>
          <FormalismTab regulationFragmentId={selectedFragmentId} />
        </TabsContent>
      </Tabs>
    </ExplanationBox>
  );
}
