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
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

// Schema for the form validation
export const prologAtomFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .regex(/^[a-z][a-z0-9_]*$/, {
      message:
        'Prolog atoms must start with a lowercase letter and contain only lowercase letters, digits, and underscores (no spaces)',
    })
    .lowercase({
      message: 'Prolog names are always lowercase',
    }),
});

interface AddPrologAtomFormProps {
  onAddAtom: (name: string) => void;
}

export function AddPrologAtomForm({ onAddAtom }: Readonly<AddPrologAtomFormProps>) {
  const form = useForm<z.infer<typeof prologAtomFormSchema>>({
    resolver: zodResolver(prologAtomFormSchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(v => {
          onAddAtom(v.name);
          form.reset();
        })}
        className="gap-4 mt-2 flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className={'flex-grow'}>
              <FormLabel>Atom</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter atom value" className="mr-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size={'lg'}>
          <Plus className="mr-1 size-4" />
          Add Prolog Atom
        </Button>
      </form>
    </Form>
  );
}
