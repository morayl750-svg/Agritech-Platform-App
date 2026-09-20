import { useState, useMemo } from 'react'
import {
  MessageSquare,
  Search,
  Users,
  ShieldCheck,
  Plus,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { useConversations } from '@/hooks/useDirectMessages'
import ChatWindow from '@/components/messages/ChatWindow'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

export default function Messages() {
  const { user } = useAuth()
  const userId = user?.id || 'default-user'
  const myName = user?.full_name || 'Beeraley'
  const myRole = user?.role === 'Merchant' ? 'buyer' : 'seller'

  const { conversations, loading, startConversation } = useConversations(userId)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const q = searchQuery.toLowerCase()
    return conversations.filter(
      (c) =>
        c.buyer_name.toLowerCase().includes(q) ||
        c.seller_name.toLowerCase().includes(q) ||
        (c.last_message && c.last_message.toLowerCase().includes(q))
    )
  }, [conversations, searchQuery])

  // Active conversation details
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeId) || null
  }, [conversations, activeId])

  const partnerName = activeConversation
    ? activeConversation.buyer_id === userId
      ? activeConversation.seller_name
      : activeConversation.buyer_name
    : ''

  const handleStartDemoChat = async () => {
    const newId = await startConversation(
      null,
      'Cali Maxamed (Ganacsade)',
      'Amina Barre (Beeraley)',
      'farmer-01'
    )
    if (newId) setActiveId(newId)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            Xiriirka Tooska ah ee Beeraleyda & Ganacsatada
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Farriimaha Tooska ah (Direct Connect)
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
            Wadahadal toos ah, suuq geyn iyo gorgortan degdeg ah oo dhexmara beeraleyda iyo iibiyeyaasha.
          </p>
        </div>

        <button
          onClick={handleStartDemoChat}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold shadow-md shadow-emerald-900/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Wadahadal Cusub</span>
        </button>
      </div>

      {/* Main Messages Layout */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl shadow-sm overflow-hidden h-[620px] grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar: Conversations List */}
        <div
          className={cn(
            'md:col-span-5 lg:col-span-4 border-r border-gray-200 dark:border-neutral-800 flex flex-col h-full bg-gray-50/50 dark:bg-neutral-900/50',
            activeId ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Search Bar */}
          <div className="p-3.5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Raadi wadahadal ama qof..."
                className="w-full bg-gray-50 dark:bg-neutral-800/70 border border-gray-200 dark:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800/60">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                Wadahadallada waa la soo rarayaa...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-neutral-500 text-xs">
                Wax wadahadal ah lama helin
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeId
                const title = conv.buyer_id === userId ? conv.seller_name : conv.buyer_name

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={cn(
                      'w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-gray-100/70 dark:hover:bg-neutral-800/50 cursor-pointer',
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-l-4 border-emerald-600'
                        : ''
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {title}
                        </p>
                        {conv.last_message_at && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(conv.last_message_at).toLocaleDateString('so-SO', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">
                        {conv.last_message || 'Wali farriin lama dirin'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Window */}
        <div
          className={cn(
            'md:col-span-7 lg:col-span-8 h-full flex flex-col',
            !activeId ? 'hidden md:flex' : 'flex'
          )}
        >
          {activeConversation ? (
            <>
              {/* Mobile Back Button */}
              <div className="md:hidden flex items-center px-4 py-2 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                <button
                  onClick={() => setActiveId(null)}
                  className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold py-1 px-2 rounded-lg hover:bg-emerald-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ku noqo wadahadallada</span>
                </button>
              </div>

              <ChatWindow
                conversationId={activeConversation.id}
                myRole={myRole}
                myName={myName}
                myId={userId}
                partnerName={partnerName}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-neutral-500">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                Dooro Wadahadal
              </h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-sm mt-1">
                Guji mid ka mid ah wadahadallada dhanka bidix si aad u aragto farriimaha ama u bilowdo sheeko cusub.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
