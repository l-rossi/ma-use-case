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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRegulationFragment } from '@/components/features/regulation-fragments/regulation-fragments.api';
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
import { LLMIdentifier, RegulationFragmentDTO } from '@dtos/dto-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { llmIdentifierToName } from '@/lib/enumToName';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  content: z.string().min(1, {
    message: 'Content is required.',
  }),
  source: z.string().optional(),
  llm_identifier: z.string(),
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
      source: '',
      llm_identifier: 'GEMINI_2_5_FLASH' satisfies LLMIdentifier,
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
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['regulation-fragments'] });
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
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter regulation fragment title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="llm_identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use Model *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(llmIdentifierToName).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input placeholder="Enter source (optional)" {...field} />
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
              <FormLabel>Content *</FormLabel>
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
