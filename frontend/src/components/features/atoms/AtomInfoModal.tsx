'use client';

import { useState } from 'react';
import { AtomDTO } from '@dtos/dto-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Info } from 'lucide-react';

interface AtomInfoModalProps {
  atom: AtomDTO;
  showButton?: boolean;
}

export function AtomInfoModal({ atom, showButton = true }: AtomInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!showButton) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="ml-2 p-1 hover:bg-gray-300 rounded"
          title="View atom description"
        >
          <Info className="size-4 text-blue-500" />
        </button>
      </DialogTrigger>
      <DialogContent title="Atom Description">
        <DialogTitle>{atom.predicate}</DialogTitle>
        <DialogDescription className="mt-4 whitespace-pre-wrap">
          {atom.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}