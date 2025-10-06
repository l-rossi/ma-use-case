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
        renderChatSuggestions
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
