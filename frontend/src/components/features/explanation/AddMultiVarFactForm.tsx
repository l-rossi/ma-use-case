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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useMemo } from 'react';
import { AtomDTO } from '@dtos/dto-types';
import { variableRegex } from '@/lib/utils';
import { Label } from '@/components/ui/Label';
import { PrologAtom } from '@/hooks/useExamplesStore';

interface Props {
  predicates: AtomDTO[];
  atoms: PrologAtom[];
  onAddFact: (predicateId: number, variableAtoms: Record<string, string>) => void;
}

export function AddMultiVarFactForm({ predicates, atoms, onAddFact }: Readonly<Props>) {
  const formSchema = z.object({
    predicateId: z.string(),
    assignments: z.record(z.string(), z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predicateId: undefined,
      assignments: {},
    },
  });
  const predicateId = form.watch('predicateId');
  const assignments = form.watch('assignments');
  const selectedPredicate = useMemo(
    () => predicates.find(p => p.id.toString() === predicateId),
    [predicateId, predicates]
  );
  const variables = useMemo(() => {
    if (!selectedPredicate) return [];
    const match = selectedPredicate.predicate.match(variableRegex);
    return match ? Array.from(new Set(match)) : [];
  }, [selectedPredicate]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(v => {
            const variableAtoms: Record<string, string> = {};
            variables.forEach(variable => {
              variableAtoms[variable] = v.assignments[variable] || '';
            });
            onAddFact(parseInt(v.predicateId, 10), variableAtoms);
            form.reset();
          })}
          className="gap-4 flex flex-col"
        >
          <FormField
            control={form.control}
            name="predicateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Predicate</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a predicate" />
                    </SelectTrigger>
                    <SelectContent>
                      {predicates.map(predicate => (
                        <SelectItem key={predicate.id} value={predicate.id.toString()}>
                          {predicate.predicate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {variables.length > 0 && (
            <div className="space-y-4 mt-2">
              <h6 className="text-sm font-medium">Assign atoms to variables:</h6>
              {variables.map(variable => (
                <div key={variable} className="flex flex-col">
                  <Label className="mb-1">Atom for variable &quot;{variable}&quot;:</Label>
                  <Select
                    required
                    value={assignments[variable] || ''}
                    onValueChange={value => {
                      form.setValue('assignments', {
                        ...assignments,
                        [variable]: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an atom" />
                    </SelectTrigger>
                    <SelectContent>
                      {atoms.map(atom => (
                        <SelectItem key={atom.id} value={atom.id}>
                          {atom.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            size={'lg'}
            disabled={!predicateId || Object.keys(assignments).length !== variables.length}
          >
            <Plus className="mr-1 size-4" />
            Add Fact
          </Button>
        </form>
      </Form>
    </div>
  );
}
