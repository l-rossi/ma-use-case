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
        <Button variant="outline"  size="sm">
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
