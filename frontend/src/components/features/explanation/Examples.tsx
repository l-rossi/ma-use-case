import { useMemo } from 'react';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { ChevronDown, LoaderCircle, Play, Trash } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { cn, countUniqueVariables, insertAtomsIntoVariables, variableRegex } from '@/lib/utils';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible';
import { runExample } from '@/components/features/explanation/explanation.api';
import { useExamples } from '@/hooks/useExamplesStore2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { AddPrologAtomModal } from './AddPrologAtomModal';
import { AddMultiVarFactModal } from './AddMultiVarFactModal';

interface Props {
  className?: string;
}

export function Examples({ className }: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();
  const { data: atoms = [] } = useAtoms(selectedFragmentId);

  const unaryPredicates = useMemo(
    () => atoms.filter(atom => atom.is_fact && countUniqueVariables(atom.predicate) === 1),
    [atoms]
  );

  const multiVarPredicates = useMemo(
    () => atoms.filter(atom => atom.is_fact && countUniqueVariables(atom.predicate) > 1),
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
  } = useExamples(selectedFragmentId || -1);

  const multiVarPredicateFacts = useMemo(
    () =>
      prologFacts.filter(fact =>
        multiVarPredicates.some(predicate => predicate.id === fact.predicateId)
      ),
    [multiVarPredicates, prologFacts]
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

      const facts = prologFacts
        .map(fact => insertAtomsIntoVariables(atoms, prologAtoms, fact))
        .join('\n');

      return runExample(selectedFragmentId, {
        facts: facts,
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
        <div className={'flex flex-row gap-4 items-center justify-between'}>
          <h4 className="font-medium mb-2">Prolog Atoms</h4>
          <AddPrologAtomModal onAddAtom={addPrologAtom} />
        </div>

        {unaryPredicates.length === 0 ? (
          <div className="space-y-2">
            <p className="text-gray-500">No fact atoms found for this regulation fragment.</p>
          </div>
        ) : (
          <>
            {/* List of created atoms */}
            {prologAtoms.length > 0 ? (
              <div className="space-y-4">
                {prologAtoms.map(prologAtom => (
                  <Collapsible
                    key={prologAtom.id}
                    className="border px-1 py-1 rounded-md"
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
                                  Object.values(fact.prologAtoms).includes(prologAtom.id)
                              )}
                              onCheckedChange={v => {
                                if (v) {
                                  const fact = addFact(predicate.id);
                                  const variable = predicate.predicate.match(variableRegex)?.[0];
                                  if (!variable) {
                                    console.warn(
                                      `No variable found in predicate ${predicate.predicate}`
                                    );
                                    return;
                                  }
                                  setAtomIdForFact(fact.id, prologAtom.id, variable);
                                } else {
                                  const fact = prologFacts.find(
                                    fact =>
                                      fact.predicateId === predicate.id &&
                                      Object.values(fact.prologAtoms).includes(prologAtom.id)
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
            ) : (
              <p className="text-sm text-gray-500">
                No atoms created yet. Click "+ Atom" to create one.
              </p>
            )}

            <hr className={'mt-6'} />

            <div className="mb-6 mt-6">
              <div className="flex flex-row gap-4 items-center justify-between mb-4">
                <h4 className="font-medium">Multi-Variable Facts</h4>
                <AddMultiVarFactModal
                  predicates={multiVarPredicates}
                  atoms={prologAtoms}
                  onAddFact={(predicateId, variableAtoms) => {
                    const fact = addFact(predicateId);
                    Object.entries(variableAtoms).forEach(([variable, atomId]) => {
                      setAtomIdForFact(fact.id, atomId, variable);
                    });
                  }}
                />
              </div>

              {multiVarPredicateFacts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No multi-variable facts created yet. Click "+ Fact" to create one.
                </p>
              ) : (
                <div className="space-y-4">
                  {multiVarPredicateFacts.map(fact => {
                    const predicate = atoms.find(a => a.id === fact.predicateId);
                    if (!predicate) return null;
                    const variables = predicate.predicate.match(variableRegex) || [];

                    return (
                      <Collapsible key={fact.id} className="border rounded-md p-1">
                        <div className="flex justify-start items-center">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="group mr-1">
                              <ChevronDown className="size-4 group-data-[state=open]:rotate-180 rotate-0 will-change-transform duration-100 transform" />
                            </Button>
                          </CollapsibleTrigger>

                          <div>
                            <h6 className="font-medium">
                              {insertAtomsIntoVariables(atoms, prologAtoms, fact)}
                            </h6>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFact(fact.id)}
                            className={'ml-auto'}
                          >
                            <Trash className="text-red-900 size-4" />
                          </Button>
                        </div>

                        <CollapsibleContent className={'p-1'}>
                          {predicate.description && (
                            <span className="text-xs text-gray-500">{predicate.description}</span>
                          )}

                          {variables.map(variable => (
                            <div key={variable} className="flex flex-col mt-2">
                              <Label className="mb-1">
                                Atom for variable &quot;{variable}&quot;:
                              </Label>
                              <Select
                                value={fact.prologAtoms[variable] || ''}
                                onValueChange={value => {
                                  if (value) {
                                    setAtomIdForFact(fact.id, value, variable);
                                  } else {
                                    setAtomIdForFact(fact.id, null, variable);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an atom" />
                                </SelectTrigger>
                                <SelectContent>
                                  {prologAtoms.map(atom => (
                                    <SelectItem key={atom.id} value={atom.id}>
                                      {atom.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </div>

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
