import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface Props {
  regulationFragmentId: number;
}

export function FormalismTab({ regulationFragmentId }: Readonly<Props>) {
  const [formalism, setFormalism] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormalism = async () => {
      if (!regulationFragmentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/formalism`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch formalism: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFormalism(data.text);
      } catch (err) {
        console.error('Error fetching formalism:', err);
        setError('Failed to load formalism. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormalism();
  }, [regulationFragmentId]);

  if (loading) {
    return <div className="p-4">Loading formalism...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!formalism) {
    return <div className="p-4">No formalism available for this regulation fragment.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Download formalism"
          title="Download formalism"
          asChild
        >
          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/formalism/download`} download target="_blank">
            <Download className="size-4" />
          </a>
        </Button>
      </div>
      
      <div className="border p-4 rounded-md bg-gray-50">
        <FormattedMarkdown>{`\`\`\`prolog\n${formalism}\n\`\`\``}</FormattedMarkdown>
      </div>
    </div>
  );
}