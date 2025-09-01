"use client";

import { Button } from "@/components/ui/Button";

interface Props {
  disabled?: boolean;
  onSelect: (text: string) => void;
  className?: string;
}

const SUGGESTIONS = [
  "Feedback the current formalism",
  "How can I simplify the knowledge base?",
  "Explain the rules",
  "...",
];

export function ChatEmptySuggestions({ disabled, onSelect, className }: Readonly<Props>) {
  return (
    <div className={"flex flex-col items-center justify-center text-center gap-4 mb-auto mt-12 " + (className ?? "") }>
      <p className="text-gray-500">No messages yet. Try one of these suggestions:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map(text => (
          <Button
            key={text}
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            className="rounded-full border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            onClick={() => onSelect(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ChatEmptySuggestions;
