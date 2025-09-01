import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFormalism } from './explanation.api';

interface Props {
  regulationFragmentId: number;
}

export function FormalismTab({ regulationFragmentId }: Readonly<Props>) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['regulation-fragments', regulationFragmentId, 'formalism'],
    queryFn: () => getFormalism(regulationFragmentId),
    enabled: !!regulationFragmentId,
  });

  const formalism = data?.text;

  if (isLoading) {
    return <div className="p-4">Loading formalism...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'Failed to load formalism. Please try again.'}
      </div>
    );
  }

  if (!formalism) {
    return <div className="p-4">No formalism available for this regulation fragment.</div>;
  }

  return (
    <div className="p-4 overflow-hidden flex flex-col w-full">
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Download formalism"
          title="Download formalism"
          asChild
        >
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-fragments/${regulationFragmentId}/formalism/download`}
            download
            target="_blank"
          >
            <Download className="size-4" />
          </a>
        </Button>
      </div>

      <div className="text-black whitespace-pre-wrap font-mono overflow-y-auto h-full">
        {formalism}
      </div>
    </div>
  );
}
