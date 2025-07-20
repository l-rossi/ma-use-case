'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createAtom } from './atoms.api';
import { CreateAtomDTO } from '@dtos/dto-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Plus } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState } from 'react';

const formSchema = z.object({
  regulation_fragment_id: z.number().int().positive(),
  predicate: z.string().min(1, { message: 'Predicate is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

interface Props {
  regulationFragmentId: number;
}

export function CreateAtomModal({ regulationFragmentId }: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regulation_fragment_id: regulationFragmentId,
      predicate: '',
      description: '',
    },
  });

  const createAtomMutation = useMutation({
    mutationFn: (data: CreateAtomDTO) => createAtom(data),
    onSuccess: () => {
      form.reset();
      setIsOpen(false);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['atoms', regulationFragmentId],
      }),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAtomMutation.mutate({
      ...values,
      is_negated: false,
    });
  }

  return (
    <Dialog
      onOpenChange={b => {
        setIsOpen(b);
        if (!b) {
          form.reset();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button type={'button'} variant="default" size="sm" className={'mt-6'}>
          <Plus className="mr-2 size-4" />
          Add Atom
        </Button>
      </DialogTrigger>
      <DialogContent title="Add Atom">
        <DialogTitle>Add new Atom</DialogTitle>

        <VisuallyHidden>
          <DialogDescription>
            Fill in the details below to create a new atom for the regulation fragment.
          </DialogDescription>
        </VisuallyHidden>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!regulationFragmentId && (
              <FormField
                control={form.control}
                name="regulation_fragment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regulation Fragment ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter regulation fragment ID"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="predicate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Predicate</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter predicate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createAtomMutation.isPending}>
              {createAtomMutation.isPending ? 'Adding...' : 'Add Atom'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
