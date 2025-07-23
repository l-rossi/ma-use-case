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
import { Trash2 } from 'lucide-react';
import { RuleView } from '@/components/features/rules/RuleView';

interface Props {
  className?: string;
}

export function Rules({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const { data: atoms = [] } = useAtoms(selectedFragmentId);
  const { data: rules = [], isPending, isError, refetch } = useRules(selectedFragmentId);

  const queryClient = useQueryClient();
  const generateRulesMutation = useMutation({
    mutationFn: () => generateRulesForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['rules', selectedFragmentId],
      }),
  });

  const deleteRulesMutation = useMutation({
    mutationFn: () => deleteRulesForFragment(selectedFragmentId!),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['rules', selectedFragmentId],
      }),
  });

  if (!selectedFragmentId) {
    return (
      <Box className={cn('shadow-rose-500 flex items-center justify-center p-4', className)}>
        Please select a fragment first
      </Box>
    );
  }

  if (atoms.length === 0) {
    return (
      <Box className={cn('shadow-rose-500 flex items-center justify-center p-4', className)}>
        Generate atoms first
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
          'text-red-500 shadow-rose-500 p-4 flex flex-col items-center justify-center',
          className
        )}
      >
        <p className="mb-4">Failed to load rules.</p>
        <Button variant={'outline'} type={'button'} size={'lg'} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (rules.length === 0) {
    return (
      <Box
        className={cn('shadow-rose-500 p-4 flex flex-col items-center justify-center', className)}
      >
        <p className="mb-4">No rules found for this fragment</p>
        <Button
          variant={'outline'}
          type={'button'}
          onClick={() => generateRulesMutation.mutate()}
          disabled={generateRulesMutation.isPending}
        >
          {generateRulesMutation.isPending ? 'Generating...' : 'Generate Rules'}
        </Button>
      </Box>
    );
  }

  return (
    <Box className={cn(className, 'shadow-rose-500 p-4 flex flex-col')}>
      <div className="flex gap-2 items-center mb-4">
        <h3 className="text-lg font-semibold">Rules</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteRulesMutation.mutate()}
          disabled={deleteRulesMutation.isPending}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className={"flex flex-col overflow-y-auto"}>
        <ul className="flex flex-col gap-2">
          {rules
            .filter(rule => !rule.is_goal)
            .map(rule => (
              <RuleView key={rule.id} rule={rule} />
            ))}
        </ul>
        <h4 className={"font-semibold text-lg mt-4"}>Goals</h4>
        <hr className={"mb-4"}/>
        <ul className="flex flex-col gap-2">
          {rules
            .filter(rule => rule.is_goal)
            .map(rule => (
              <RuleView key={rule.id} rule={rule} />
            ))}
        </ul>
      </div>
    </Box>
  );
}
