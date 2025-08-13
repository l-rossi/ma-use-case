'use client';

import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/Box';
import { useRules } from '@/hooks/useRules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteRulesForFragment,
  generateRulesForFragment,
} from '@/components/features/rules/rules.api';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAtoms } from '@/hooks/useAtoms';
import { RuleView } from '@/components/features/rules/RuleView';
import { RegenerationForm } from '@/components/features/rules/RegenerationForm';
import { useState, ReactNode } from 'react';
import { InfoDialog } from '@/components/ui/InfoDialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { useResetExamples } from '@/hooks/useExamplesStore2';

interface Props {
  className?: string;
}

function RuleBox({ children, canDelete = false }: { children: ReactNode; canDelete?: boolean }) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const queryClient = useQueryClient();
  const resetExamples = useResetExamples(selectedFragmentId);
  const deleteRulesMutation = useMutation({
    mutationFn: () => deleteRulesForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['rules', selectedFragmentId],
      }),
    onSuccess: () => resetExamples(),
  });

  return (
    <Box className="shadow-rose-500 flex-col overflow-hidden size-full">
      <div className="flex justify items-center mb-2 gap-1 p-4 pb-0">
        <h3 className="text-lg font-semibold">Rules</h3>
        {canDelete && (
          <ConfirmDeleteDialog
            title="Rules"
            description="Are you sure you want to delete all rules for this fragment? This action cannot be undone."
            isPending={deleteRulesMutation.isPending}
            isError={deleteRulesMutation.isError}
            onDelete={() => deleteRulesMutation.mutate()}
            errorMessage="Failed to delete rules. Please try again."
          />
        )}
        <InfoDialog
          title={'Rules'}
          description={
            'Rules are logical statements derived from atoms. They represent the formalized knowledge extracted from the regulation fragment.'
          }
        />
      </div>
      {children}
    </Box>
  );
}

export function Rules({}: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const { data: atoms = [] } = useAtoms(selectedFragmentId);
  const { data: rules = [], isPending, isError, refetch } = useRules(selectedFragmentId);

  const queryClient = useQueryClient();

  const [feedback, setFeedback] = useState('');
  const generateRulesMutation = useMutation({
    mutationFn: () => generateRulesForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['rules', selectedFragmentId],
      }),
  });

  if (isPending) {
    return <Skeleton className={'size-full'} />;
  }

  if (!selectedFragmentId) {
    return (
      <RuleBox>
        <div className={'flex items-center justify-center size-full'}>
          Please select a fragment first
        </div>
      </RuleBox>
    );
  }

  if (atoms.length === 0) {
    return (
      <RuleBox>
        <div className={'flex items-center justify-center size-full'}>Generate atoms first</div>
      </RuleBox>
    );
  }

  if (isError) {
    return (
      <RuleBox>
        <div className={'flex flex-col items-center justify-center size-full'}>
          <p className="mb-4">Failed to load rules.</p>
          <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </RuleBox>
    );
  }

  if (rules.length === 0) {
    return (
      <RuleBox>
        <div className={'flex flex-col items-center justify-center size-full'}>
          <p className="mb-4">No rules found for this fragment</p>
          <Button
            variant={'outline'}
            type={'button'}
            onClick={() => generateRulesMutation.mutate()}
            disabled={generateRulesMutation.isPending}
          >
            {generateRulesMutation.isPending ? 'Generating...' : 'Generate Rules'}
          </Button>
        </div>
      </RuleBox>
    );
  }

  return (
    <RuleBox canDelete>
      <div className={'grid grid-cols-2 overflow-hidden gap-2 grow p-4 pt-0'}>
        <div className={'h-full overflow-hidden flex flex-col'}>
          <div className={'flex flex-col overflow-y-auto'}>
            <ul className="flex flex-col gap-2">
              {rules
                .filter(rule => !rule.is_goal)
                .map(rule => (
                  <RuleView key={rule.id} rule={rule} />
                ))}
            </ul>
            <h4 className={'font-semibold text-lg mt-4'}>Goals</h4>
            <hr className={'mb-4'} />
            <ul className="flex flex-col gap-2">
              {rules
                .filter(rule => rule.is_goal)
                .map(rule => (
                  <RuleView key={rule.id} rule={rule} />
                ))}
            </ul>
          </div>
        </div>

        <div className={'flex flex-col'}>
          <h3 className="text-lg font-semibold mb-2">Regenerate Rules</h3>
          <RegenerationForm
            feedback={feedback}
            setFeedback={setFeedback}
            fragmentId={selectedFragmentId}
          />
        </div>
      </div>
    </RuleBox>
  );
}
