import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { AddPrologAtomForm } from './AddPrologAtomForm';

interface AddPrologAtomModalProps {
  onAddAtom: (name: string) => void;
}

export function AddPrologAtomModal({ onAddAtom }: Readonly<AddPrologAtomModalProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddAtom = (name: string) => {
    onAddAtom(name);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4" size="sm">
          <Plus className="mr-1 size-4" />
          Atom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Prolog Atom</DialogTitle>
        </DialogHeader>
        <AddPrologAtomForm onAddAtom={handleAddAtom} />
      </DialogContent>
    </Dialog>
  );
}
