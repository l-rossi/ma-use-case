'use client';

import { useState } from 'react';
import { AtomDTO, UpdateAtomDTO } from '@dtos/dto-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Info } from 'lucide-react';
import { FactFlag } from '@/components/features/atoms/FactFlag';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAtom } from './atoms.api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const formSchema = z.object({
  predicate: z.string().min(1, { message: 'Predicate is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  is_fact: z.boolean(),
});

interface AtomInfoModalProps {
  atom: AtomDTO;
  showButton?: boolean;
}

export function AtomInfoModal({ atom, showButton = true }: AtomInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predicate: atom.predicate,
      description: atom.description,
      is_fact: atom.is_fact,
    },
  });

  const updateAtomMutation = useMutation({
    mutationFn: (data: UpdateAtomDTO) => updateAtom(atom.id, data),
    onSuccess: updatedAtom => {
      setIsEditing(false);
      form.reset({
        predicate: updatedAtom.predicate,
        description: updatedAtom.description,
        is_fact: updatedAtom.is_fact,
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['atoms', atom.regulation_fragment_id],
      }),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateAtomMutation.mutate({
      predicate: values.predicate,
      description: values.description,
      is_fact: values.is_fact,
    });
  }

  if (!showButton) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) {
          setIsEditing(false);
          form.reset({
            predicate: atom.predicate,
            description: atom.description,
            is_fact: atom.is_fact,
          });
        }
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <button
          onClick={e => e.stopPropagation()}
          className="ml-2 p-1 hover:bg-gray-300 rounded"
          title="View atom description"
        >
          <Info className="size-4 text-blue-500" />
        </button>
      </DialogTrigger>
      <DialogContent title="Atom Description">
        {!isEditing ? (
          <>
            <div className="flex items-center">
              <DialogTitle>{atom.predicate}</DialogTitle>
              <FactFlag isFact={atom.is_fact} />
            </div>
            <DialogDescription className="mt-4 whitespace-pre-wrap">
              {atom.description}
            </DialogDescription>

            <Button variant="outline" onClick={() => setIsEditing(true)} type="button">
              Edit
            </Button>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="is_fact"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormLabel>Is Fact</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset({
                      predicate: atom.predicate,
                      description: atom.description,
                      is_fact: atom.is_fact,
                    });
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAtomMutation.isPending}>
                  {updateAtomMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>

              {updateAtomMutation.error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{updateAtomMutation.error.message}</span>
                </div>
              )}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
