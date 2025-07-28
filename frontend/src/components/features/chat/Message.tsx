import { cn } from '@/lib/utils';
import { ChatMessageDTO } from '@dtos/dto-types';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface Props {
  message: ChatMessageDTO;
}

export function Message({ message }: Readonly<Props>) {
  return (
    <li
      className={cn(
        'p-3 flex rounded-lg justify-between items-start flex-col',
        message.agent === 'USER' ? 'bg-violet-100 rounded-br-none' : 'bg-gray-100 rounded-bl-none',
        message.agent === 'USER' ? 'ml-auto' : 'mr-auto',
        'max-w-[80%]'
      )}
    >
      <FormattedMarkdown
        codeClassName={"bg-gray-200"}
        content={message.content}
      />
      <span className="text-xs text-gray-400 self-end">
        {new Date(message.created_at).toLocaleTimeString(["de"], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </li>
  );
}
