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