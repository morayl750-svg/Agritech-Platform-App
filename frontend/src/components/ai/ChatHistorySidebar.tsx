import { Plus, MessageSquare, History } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useChatHistory } from '@/hooks/useChatHistory'
import { cn } from '@/lib/cn'
import type { ChatHistorySidebarProps } from '@/types'

export function ChatHistorySidebar({
  isOpen,
  activeChatId,
  onSelectChat,
  onNewChat,
}: ChatHistorySidebarProps) {
  const { sessions, isLoading } = useChatHistory()

  return (
    <aside
      aria-label="Chat history sidebar"
      className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 bg-white flex flex-col h-full',
        isOpen ? 'w-64 border-r border-gray-200 p-3 opacity-100 mr-2' : 'w-0 p-0 border-r-0 opacity-0 mr-0'
      )}
    >
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-medium transition-colors cursor-pointer shadow-2xs mb-4 flex-shrink-0"
      >
        <Plus size={15} />
        <span>New Chat</span>
      </button>

      {/* History List Header */}
      <div className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-2 flex-shrink-0">
        <History size={12} />
        <span>Recent Conversations</span>
      </div>

      {/* History Items */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-3 py-2 rounded-lg space-y-1.5">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-2 w-16" />
              </div>
            ))
          : sessions.map((chat) => {
              const isActive = chat.id === activeChatId
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer group',
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium shadow-2xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <MessageSquare
                    size={14}
                    className={cn(
                      'flex-shrink-0',
                      isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{chat.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{chat.date}</p>
                  </div>
                </button>
              )
            })}
      </div>
    </aside>
  )
}
