import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AtomDTO } from '@dtos/dto-types';

interface FactInputProps {
  atom: AtomDTO;
  values: string[];
  onAddValue: (value: string) => void;
  onRemoveValue: (valueIndex: number) => void;
}

export function FactInput({ atom, values, onAddValue, onRemoveValue }: FactInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddValue = () => {
    if (inputValue.trim()) {
      onAddValue(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="border p-3 rounded-md">
      <h4 className="font-medium mb-2">{atom.predicate}</h4>
      <p className="text-sm text-gray-500 mb-2">{atom.description}</p>
      
      <div className="flex items-center mb-2">
        <Input
          placeholder={`Add value for ${atom.predicate}`}
          className="mr-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              handleAddValue();
            }
          }}
        />
        <Button onClick={handleAddValue}>Add</Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {values.map((value, valueIndex) => (
          <div key={valueIndex} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
            <span>{value}</span>
            <button
              className="ml-1 text-gray-500 hover:text-red-500"
              onClick={() => onRemoveValue(valueIndex)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}