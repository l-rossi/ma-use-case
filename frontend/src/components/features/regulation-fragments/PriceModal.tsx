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

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CircleDollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { getRegulationFragmentCost } from './regulation-fragments.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMemo } from 'react';

interface PriceModalProps {
  fragmentId: number;
  className?: string;
}

export function PriceModal({ fragmentId, className }: PriceModalProps) {
  const {
    data: priceData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['regulation-fragments', fragmentId, 'cost'],
    queryFn: () => getRegulationFragmentCost(fragmentId),
    enabled: !!fragmentId,
  });

  const queryClient = useQueryClient();

  const formattedPrice = useMemo(() => {
    if (!priceData) return '';
    // cents to dollars
    const priceInDollars = priceData.price / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInDollars);
  }, [priceData]);

  return (
    <Dialog
      onOpenChange={b => {
        if (b) {
          void queryClient.invalidateQueries({
            queryKey: ['regulation-fragments', fragmentId, 'cost'],
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="View estimated cost"
          title="View estimated cost"
        >
          <CircleDollarSign className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>Estimated Cost</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              The estimated cost for this regulation fragment based on token usage.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="py-4">
          {isPending && <Skeleton className="h-20 w-full" />}

          {isError && (
            <div className="text-red-500">
              Error loading price information:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}

          {priceData && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Estimated Cost</div>
                <div className="text-3xl font-bold">{formattedPrice}</div>
              </div>

              <div className="text-sm text-gray-500 space-y-2 border-t pt-2">
                <p>
                  <strong>Disclaimer: </strong>
                  This is an estimate based on the current token usage and may not reflect the final
                  cost. The actual price may vary based on for example free tier benefits.
                </p>
                <p>Token prices are hardcoded and fixed as of August 13, 2025.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
