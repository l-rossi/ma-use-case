import { useEffect, useMemo, useState } from 'react';
import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { LoaderCircle, Plus, X, ChevronDown, ChevronUp, Trash, Play } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { executeWithExamples } from './explanation.api';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { AtomDTO } from '@dtos/dto-types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible';

interface Props {
  className?: string;
}

interface AtomValue {
  id: string;
  value: string;
  predicates: number[]; // IDs of the predicates assigned to this atom
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

  // State for user-created atoms (values)
  const [atomValues, setAtomValues] = useState<AtomValue[]>([]);
  const [newAtomValue, setNewAtomValue] = useState('');

  // Reset atom values when fragment changes
  useEffect(() => {
    setAtomValues([]);
    setNewAtomValue('');
  }, [selectedFragmentId]);

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

      // Build facts object by grouping by predicate
      const facts: Record<string, string[]> = {};

      // For each atom value, add it to all assigned predicates
      atomValues.forEach(atomValue => {
        atomValue.predicates.forEach(predicateId => {
          const atom = factAtoms.find(a => a.id === predicateId);
          if (atom) {
            if (!facts[atom.predicate]) {
              facts[atom.predicate] = [];
            }
            facts[atom.predicate].push(atomValue.value);
          }
        });
      });

      return executeWithExamples(selectedFragmentId, facts);
    },
  });

  // Prepare data for ResultsDisplay
  const status = isError ? 'error' : data?.status || null;
  const answers = isError
    ? [{ status: 'error', answers: [], message: 'Failed to execute query' }]
    : data?.answers || null;

  const handleAddAtom = () => {
    if (newAtomValue.trim()) {
      // Convert atom value to lowercase before adding
      const lowerCaseValue = newAtomValue.trim().toLowerCase();
      setAtomValues(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          value: lowerCaseValue,
          predicates: [],
        },
      ]);
      setNewAtomValue('');
    }
  };

  const handleRemoveAtom = (atomId: string) => {
    setAtomValues(prev => prev.filter(atom => atom.id !== atomId));
  };

  const handleTogglePredicate = (atomId: string, predicateId: number) => {
    setAtomValues(prev =>
      prev.map(atom => {
        if (atom.id === atomId) {
          const predicates = atom.predicates.includes(predicateId)
            ? atom.predicates.filter(id => id !== predicateId)
            : [...atom.predicates, predicateId];
          return { ...atom, predicates };
        }
        return atom;
      })
    );
  };

  const handleExecuteQuery = () => {
    executeQuery();
  };

  return (
    <div className={cn('overflow-y-auto relative pb-24', className)}>
      <div className="p-4">
        {factAtoms.length === 0 ? (
          <div className="space-y-2">
            <p className="text-gray-500">No unary fact atoms found for this regulation fragment.</p>
          </div>
        ) : (
          <>
            {/* Add new atom value */}
            <div className="mb-6 rounded-md">
              <h4 className="font-medium mb-2">Create Atom</h4>
              <div className="flex items-center mb-2">
                <Input
                  placeholder="Enter atom value"
                  className="mr-2"
                  value={newAtomValue}
                  onChange={e => setNewAtomValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newAtomValue.trim()) {
                      handleAddAtom();
                    }
                  }}
                />
                <Button onClick={handleAddAtom}>
                  <Plus className="mr-1 size-4" />
                  Add
                </Button>
              </div>
            </div>

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
                          onClick={() => handleRemoveAtom(atom.id)}
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
                                checked={atom.predicates.includes(predicate.id)}
                                onCheckedChange={() => handleTogglePredicate(atom.id, predicate.id)}
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
              onClick={handleExecuteQuery}
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

      <ResultsDisplay status={status} answers={answers} />
    </div>
  );
}
