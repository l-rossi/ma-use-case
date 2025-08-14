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
import { AddMultiVarFactForm } from './AddMultiVarFactForm';
import { AtomDTO } from '@dtos/dto-types';
import { PrologAtom } from '@/hooks/useExamplesStore';


interface Props {
  predicates: AtomDTO[];
  atoms: PrologAtom[];
  onAddFact: (predicateId: number, variableAtoms: Record<string, string>) => void;
}

export function AddMultiVarFactModal({ 
  predicates, 
  atoms, 
  onAddFact,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFact = (predicateId: number, variableAtoms: Record<string, string>) => {
    onAddFact(predicateId, variableAtoms);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 size-4" />
          Fact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Multi-Variable Fact</DialogTitle>
        </DialogHeader>
        <AddMultiVarFactForm 
          predicates={predicates} 
          atoms={atoms} 
          onAddFact={handleAddFact} 
        />
      </DialogContent>
    </Dialog>
  );
}