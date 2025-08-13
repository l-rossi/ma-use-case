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
import { AddPrologAtomForm } from './AddPrologAtomForm';
import { runExample } from '@/components/features/explanation/explanation.api';
import { useExamples2 } from '@/hooks/useExamplesStore2';

interface Props {
  className?: string;
}

export function Examples({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const { data: atoms = [] } = useAtoms(selectedFragmentId);

  const isUnaryPredicate = (predicate: string): boolean => {
    if (!predicate.includes('(') || !predicate.includes(')')) {
      return false;
    }

    const argsMatch = predicate.match(/\((.*)\)/);
    if (!argsMatch) {
      return false;
    }

    const args = argsMatch[1].split(',').map(arg => arg.trim());

    return args.length === 1;
  };

  const unaryPredicates = useMemo(
    () => atoms.filter(atom => atom.is_fact && isUnaryPredicate(atom.predicate)),
    [atoms]
  );

  const {
    prologAtoms,
    prologFacts,
    addPrologAtom,
    removePrologAtom,
    addFact,
    removeFact,
    setAtomIdForFact,
  } = useExamples2(selectedFragmentId || -1);

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

      // const facts = atomValues
      //   .flatMap(atomValue =>
      //     atomValue.unaryPredicates.map(predicateId => {
      //       const predicate = factAtoms.find(p => p.id === predicateId);
      //       if (!predicate) {
      //         throw new Error(`Predicate with ID ${predicateId} not found`);
      //       }
      //       // TODO extract to some slightly more solid function...
      //       const predicateName = predicate.predicate.split('(')[0];
      //       return `${predicateName}(${atomValue.value}).`;
      //     })
      //   )
      //   .join('\n');
      //
      // return runExample(selectedFragmentId, {
      //   facts: facts,
      // });
      return runExample(selectedFragmentId, {
        facts: '',
      });
    },
  });

  const status = isError ? 'error' : data?.status || null;

  if (!selectedFragmentId) {
    return (
      <div className={cn('', className)}>
        <p className="text-gray-500">Please select a regulation fragment to view examples.</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-y-auto pb-24', className)}>
      <div className="p-4">
        {unaryPredicates.length === 0 ? (
          <div className="space-y-2">
            <p className="text-gray-500">No unary fact atoms found for this regulation fragment.</p>
          </div>
        ) : (
          <>
            <AddPrologAtomForm onAddAtom={addPrologAtom} />

            {/* List of created atoms */}
            {prologAtoms.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Your Atoms</h4>
                <div className="space-y-4">
                  {prologAtoms.map(prologAtom => (
                    <Collapsible
                      key={prologAtom.id}
                      className="border px-3 py-2 rounded-md"
                      defaultOpen={true}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="group mr-1">
                              <ChevronDown className="size-4 group-data-[state=open]:rotate-180 rotate-0 will-change-transform duration-100 transform" />
                            </Button>
                          </CollapsibleTrigger>
                          <h5 className="font-semibold">{prologAtom.value}</h5>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePrologAtom(prologAtom.id)}
                        >
                          <Trash className="text-red-900 size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className={'pb-2'}>
                        <h6 className="text-sm text-gray-500 mb-2">Assign predicates:</h6>
                        <div className="space-y-2">
                          {unaryPredicates.map(predicate => (
                            <div key={predicate.id} className="flex items-center">
                              <Checkbox
                                id={`${prologAtom.id}-${predicate.id}`}
                                checked={prologFacts.some(
                                  fact =>
                                    fact.predicateId === predicate.id &&
                                    fact.prologAtomIds.includes(prologAtom.id)
                                )}
                                onCheckedChange={v => {
                                  if (v) {
                                    const fact = addFact(predicate.id);
                                    setAtomIdForFact(fact.id, prologAtom.id, 0);
                                  } else {
                                    const fact = prologFacts.find(
                                      fact =>
                                        fact.predicateId === predicate.id &&
                                        fact.prologAtomIds.includes(prologAtom.id)
                                    );
                                    if (!fact) return;
                                    removeFact(fact.id);
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`${prologAtom.id}-${predicate.id}`}
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
                        <CollapsibleTrigger asChild>
                          <Button
                            size={'sm'}
                            className={'mt-4 text-xs py-0.5 px-2 h-6'}
                            variant={'default'}
                          >
                            Done
                          </Button>
                        </CollapsibleTrigger>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="mt-4 w-full absolute bottom-4 rounded-full size-12 right-4 overflow-hidden"
              onClick={() => executeQuery()}
              disabled={isPending || prologAtoms.length === 0}
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
