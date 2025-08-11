import { useMemo } from 'react';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { ChevronDown, LoaderCircle, Play, Trash } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible';
import { useExamples } from '@/hooks/useExamplesStore';
import { AddPrologAtomForm } from './AddPrologAtomForm';
import { runExample } from '@/components/features/explanation/explanation.api';

interface Props {
  className?: string;
}

export function Examples({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const { data: atoms = [] } = useAtoms(selectedFragmentId);

  // Helper function to check if a predicate is unary (only has one variable)
  const isUnaryPredicate = (predicate: string): boolean => {
    // Check if the predicate contains parentheses
    if (!predicate.includes('(') || !predicate.includes(')')) {
      return false;
    }

    // Extract the arguments part between parentheses
    const argsMatch = predicate.match(/\((.*)\)/);
    if (!argsMatch) {
      return false;
    }

    const args = argsMatch[1].split(',').map(arg => arg.trim());

    // Check if there's exactly one argument
    return args.length === 1;
  };

  // Filter atoms that are facts and have unary predicates
  const factAtoms = useMemo(
    () => atoms.filter(atom => atom.is_fact && isUnaryPredicate(atom.predicate)),
    [atoms]
  );

  // Use the Zustand store for state management with the selected fragment ID as key
  const { atomValues, addAtomValue, removeAtomValue, togglePredicate } = useExamples(
    selectedFragmentId || -1
  );

  const {
    mutate: executeQuery,
    isPending,
    data,
    isError,
  } = useMutation({
    mutationFn: () => {
      if (!selectedFragmentId) {
        throw new Error('No regulation fragment selected');
      }

      // TODO n-ary predicates for n > 1

      const facts = atomValues
        .flatMap(atomValue =>
          atomValue.unaryPredicates.map(predicateId => {
            const predicate = factAtoms.find(p => p.id === predicateId);
            if (!predicate) {
              throw new Error(`Predicate with ID ${predicateId} not found`);
            }
            // TODO extract to some slightly more solid function...
            const predicateName = predicate.predicate.split('(')[0];
            return `${predicateName}(${atomValue.value}).`;
          })
        )
        .join('\n');

      return runExample(selectedFragmentId, {
        facts: facts,
      });
    },
  });

  // Prepare data for ResultsDisplay
  const status = isError ? 'error' : data?.status || null;

  if (!selectedFragmentId) {
    return (
      <div className={cn('p-4', className)}>
        <p className="text-gray-500">Please select a regulation fragment to view examples.</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-y-auto pb-24', className)}>
      <div className="p-4">
        {factAtoms.length === 0 ? (
          <div className="space-y-2">
            <p className="text-gray-500">No unary fact atoms found for this regulation fragment.</p>
          </div>
        ) : (
          <>
            <AddPrologAtomForm onAddAtom={addAtomValue} />

            {/* List of created atoms */}
            {atomValues.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Your Atoms</h4>
                <div className="space-y-4">
                  {atomValues.map(atom => (
                    <Collapsible
                      key={atom.id}
                      className="border px-3 py-2 rounded-md"
                      defaultOpen={true}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-1">
                              <ChevronDown className="size-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <h5 className="font-semibold">{atom.value}</h5>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAtomValue(atom.id)}
                        >
                          <Trash className="text-red-900 size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className={'pb-2'}>
                        <h6 className="text-sm text-gray-500 mb-2">Assign predicates:</h6>
                        <div className="space-y-2">
                          {factAtoms.map(predicate => (
                            <div key={predicate.id} className="flex items-center">
                              <Checkbox
                                id={`${atom.id}-${predicate.id}`}
                                checked={atom.unaryPredicates.includes(predicate.id)}
                                onCheckedChange={() => togglePredicate(atom.id, predicate.id)}
                              />
                              <Label
                                htmlFor={`${atom.id}-${predicate.id}`}
                                className="ml-2 cursor-pointer"
                              >
                                {predicate.predicate}
                                <span className="text-xs text-gray-500 ml-2">
                                  {predicate.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="mt-4 w-full absolute bottom-4 rounded-full size-12 right-4 overflow-hidden"
              onClick={() => executeQuery()}
              disabled={isPending || atomValues.length === 0}
            >
              {isPending ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Play className="size-5" />
              )}
            </Button>
          </>
        )}
      </div>

      <ResultsDisplay status={status} answers={data?.answers ?? []} />
    </div>
  );
}
