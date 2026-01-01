/**
 * MessageBubble Component
 *
 * Renders a single message with styling based on role (user/assistant)
 */

'use client';

import { Message } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl px-5 py-4 shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border border-purple-500/30'
            : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white'
        }`}
      >
        {/* Role Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[10px] font-black uppercase tracking-[0.15em] ${
              isUser
                ? 'text-purple-200'
                : 'text-purple-400'
            }`}
          >
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span
            className={`text-[9px] ${
              isUser
                ? 'text-purple-300'
                : 'text-gray-500'
            }`}
          >
            {timeAgo}
          </span>
        </div>

        {/* Message Content */}
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
