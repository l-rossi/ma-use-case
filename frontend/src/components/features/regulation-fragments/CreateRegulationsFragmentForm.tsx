'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRegulationFragment } from '@/components/features/regulation-fragments/regulation_fragments.api';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RegulationFragmentDTO } from '../../../../generated/dto-types';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  content: z.string().min(1, {
    message: 'Content is required.',
  }),
});

interface Props {
  className?: string;
  onSuccess?: (fragment: RegulationFragmentDTO) => Promise<void> | void;
}

export function CreateRegulationFragmentForm({ className, onSuccess }: Readonly<Props>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const createFragmentMutation = useMutation({
    mutationFn: createRegulationFragment,
    onSuccess: f => {
      toast.success('Regulation fragment created successfully');
      form.reset();
      return onSuccess?.(f);
    },
    onError: error => {
      console.error('Error creating regulation fragment:', error);
      toast.error('Failed to create regulation fragment');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['regulation-fragments'] });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    createFragmentMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter regulation fragment title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter regulation fragment content"
                  className="min-h-64"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Regulation Fragment'}
        </Button>
      </form>
    </Form>
  );
}
