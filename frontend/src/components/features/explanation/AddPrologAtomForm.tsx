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
  name: z.string().min(1, { message: 'Name is required' }).lowercase({
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
    <div className="mb-6 rounded-md">
      <h4 className="font-medium mb-2">Create Prolog Atom</h4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(v => {
            onAddAtom(v.name);
            form.reset(); // Reset the form after submission
          })}
          className="gap-4 flex flex-row"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className={'flex-grow'}>
                <FormLabel>Predicate</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter atom value" className="mr-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size={'lg'} className={'mt-6'}>
            <Plus className="mr-1 size-4" />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
