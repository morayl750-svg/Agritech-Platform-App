import { useState, useEffect, useRef } from 'react'
import { Send, User, Check, CheckCheck, Loader2 } from 'lucide-react'
import { useDirectMessages } from '@/hooks/useDirectMessages'
import { cn } from '@/lib/cn'

interface ChatWindowProps {
  conversationId: string
  myRole: 'buyer' | 'seller'
  myName: string
  myId: string
  partnerName: string
}

export default function ChatWindow({
  conversationId,
  myRole,
  myName,
  myId,
  partnerName,
}: ChatWindowProps) {
  const { messages, loading, sendMessage } = useDirectMessages(conversationId)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return

    const text = input
    setInput('')
    setIsSending(true)
    await sendMessage(text, myName, myRole, myId)
    setIsSending(false)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-200 dark:border-emerald-800/40">
              {partnerName.slice(0, 2).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {partnerName}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Toos u furan (Online)
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span>Farriimaha waa la soo rarayaa...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400 dark:text-neutral-500">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-2 text-xl">
              💬
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
              Farriin u dir {partnerName}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-xs mt-1">
              Halkan waxaad si toos ah ugula xaajoon kartaa qiimaha, nooca dalagga, iyo xilliga keenista.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_role === myRole || msg.sender_id === myId
            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
              >
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 flex items-center justify-center text-[10px] font-bold shrink-0 mb-1">
                    {msg.sender_name.slice(0, 1)}
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[78%] rounded-2xl px-4 py-2.5 text-xs md:text-sm shadow-2xs leading-relaxed',
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-xs border border-gray-200/60 dark:border-neutral-700/60'
                  )}
                >
                  {!isMe && (
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                      {msg.sender_name}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1 mt-1 text-[10px]',
                      isMe ? 'text-emerald-200' : 'text-gray-400 dark:text-neutral-500'
                    )}
                  >
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString('so-SO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Qor farriin aad u dirto beeraleyga ama macmiilka..."
          className="flex-1 bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          title="Dir farriinta"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  )
}
