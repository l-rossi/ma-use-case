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
import { Trash2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ConfirmDeleteDialogProps {
  title: string;
  description: string;
  isPending: boolean;
  isError: boolean;
  onDelete: () => void;
  className?: string;
  triggerClassName?: string;
  errorMessage?: string;
}

export function ConfirmDeleteDialog({
  title,
  description,
  isPending,
  isError,
  onDelete,
  className,
  triggerClassName,
  errorMessage = 'An error occurred while deleting.',
}: ConfirmDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    if (!isError) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label={`Delete ${title}`}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isError && (
          <div className="flex items-center gap-2 text-destructive mt-2">
            <AlertCircle className="size-4" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
