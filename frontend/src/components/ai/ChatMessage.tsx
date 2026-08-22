import { Bot, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ChatMessageProps } from '@/types'

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 max-w-3xl my-2.5',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium shadow-2xs mt-0.5',
          isUser
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        )}
        aria-hidden="true"
      >
        {isUser ? <User size={14} /> : <Bot size={15} className="text-gray-700" />}
      </div>

      {/* Content box */}
      <div className={cn('flex flex-col min-w-0', isUser ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <span className="text-xs font-medium text-gray-800">
            {isUser ? 'You' : 'AgriSmart AI'}
          </span>
          {!isUser && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
              <Sparkles size={9} /> Vision v2
            </span>
          )}
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-xs leading-relaxed max-w-xl shadow-2xs',
            isUser
              ? 'bg-gray-100 text-gray-900 border border-gray-200/80 rounded-tr-xs font-normal'
              : 'bg-white text-gray-900 border border-gray-200 rounded-tl-xs font-normal'
          )}
        >
          {message.imageUrl && (
            <div className="mb-2.5 overflow-hidden rounded-xl border border-gray-200 max-w-xs">
              <img
                src={message.imageUrl}
                alt="Diagnosed crop specimen"
                className="w-full h-44 object-cover"
              />
            </div>
          )}

          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  )
}
