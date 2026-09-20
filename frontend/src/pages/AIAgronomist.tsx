import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Bot, ArrowRight, Sprout, Droplets, HeartPulse, FlaskConical } from 'lucide-react'
import { ChatHeader } from '@/components/ai/ChatHeader'
import { ChatMessage } from '@/components/ai/ChatMessage'
import { ChatInput } from '@/components/ai/ChatInput'
import { VisionUploader } from '@/components/ai/VisionUploader'
import { ChatHistorySidebar } from '@/components/ai/ChatHistorySidebar'
import { useChatHistory } from '@/hooks/useChatHistory'
import { askAI } from '@/lib/api'
import type { ChatMessageItem } from '@/types'

const QUICK_TEST_PROMPTS = [
  {
    title: 'Cudurada & Cayayaanka Galayda',
    subtitle: 'Sida loo daweeyo ayaya (Fall Armyworm) beerta Afgooye',
    prompt: 'Sida loo daweeyo cayayaanka galayda ku dhaca ee Afgooye?',
    icon: Sprout,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    title: 'Jadwalka Waraabka Kuleylaha',
    subtitle: 'Kuleylka 34°C, meeqa jeer ayaa la waraabiyaa sisinta?',
    prompt: 'Kuleylka 34°C ee maanta, meeqa jeer ayaan waraabiyaa dalaga Sisinta (Sesame)?',
    icon: Droplets,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    title: 'Caafimaadka Geela & Xoolaha',
    subtitle: 'Daweynta & calaamadaha cudurka Ganaasha ee Geela',
    prompt: 'Geela calaamadaha daalka iyo cuntada ka joogsiga qaba maxaa lagu daweeyaa?',
    icon: HeartPulse,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    title: 'Bacriminta Carrada & Urea',
    subtitle: 'Talooyinka bacriminta beerta iyo isticmaalka Urea/DAP',
    prompt: 'Imisa kiilo oo bacriminta Urea ah ayaa loo baahan yahay hectarkiiba?',
    icon: FlaskConical,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
]

export default function AIAgronomist() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [isVisionOpen, setIsVisionOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [activeChatId, setActiveChatId] = useState<string | null>('demo-chat-1')

  const { sessions, createSession, fetchSessionMessages, saveMessage } = useChatHistory()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadSessionMessages = useCallback(
    async (id: string) => {
      const fetched = await fetchSessionMessages(id)
      setMessages(fetched)
    },
    [fetchSessionMessages]
  )

  // Load first demo session by default on initial page load
  useEffect(() => {
    if (activeChatId) {
      loadSessionMessages(activeChatId)
    } else if (sessions.length > 0 && !activeChatId) {
      setActiveChatId(sessions[0].id)
    }
  }, [activeChatId, sessions, loadSessionMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  async function handleSendMessage(text: string) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    let currentSessionId = activeChatId

    if (!currentSessionId) {
      const title = text.length > 28 ? `${text.substring(0, 28)}…` : text
      currentSessionId = await createSession(title)
      if (currentSessionId) setActiveChatId(currentSessionId)
    }

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
      imageUrl: previewUrl || undefined,
    }

    setMessages((prev) => [...prev, userMsg])
    setPreviewUrl(null)
    setIsVisionOpen(false)
    setIsThinking(true)

    if (currentSessionId) saveMessage(currentSessionId, 'user', text)

    try {
      const data = await askAI(text)
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const aiMsg: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response,
        timestamp: aiTimestamp,
      }

      setMessages((prev) => [...prev, aiMsg])
      if (currentSessionId) saveMessage(currentSessionId, 'model', data.response)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'AI service unavailable'
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Notice: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="flex flex-row h-full w-full relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-2xs">
      {/* Left Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={isHistoryOpen}
        activeChatId={activeChatId || ''}
        onSelectChat={(id) => {
          setActiveChatId(id)
        }}
        onNewChat={() => {
          setMessages([])
          setActiveChatId(null)
        }}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <ChatHeader
          isHistoryOpen={isHistoryOpen}
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          onClearChat={() => {
            setMessages([])
            setPreviewUrl(null)
            setIsVisionOpen(false)
          }}
        />

        {isVisionOpen && (
          <div className="flex-shrink-0">
            <VisionUploader
              onImageSelected={(file) => setPreviewUrl(URL.createObjectURL(file))}
              onClose={() => setIsVisionOpen(false)}
              previewUrl={previewUrl}
              onClearPreview={() => setPreviewUrl(null)}
            />
          </div>
        )}

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 max-w-2xl mx-auto space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
                <Bot size={32} />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">AgriSmart AI Agronomist Consultation</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md">
                  Weydii AI-ga talooyinka cudurada dalaga, jadwalka waraabka, ama caafimaadka xoolaha. 
                  Tijaabi su'aalaha diyaarsan ee hoose:
                </p>
              </div>

              {/* Interactive Quick Prompts Grid */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {QUICK_TEST_PROMPTS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-3 cursor-pointer group text-left"
                    >
                      <div className={`p-2 rounded-lg border ${item.color} flex-shrink-0 mt-0.5`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h4>
                          <ArrowRight size={12} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}

          {isThinking && (
            <div className="flex items-center gap-2 my-2 text-xs text-emerald-800 font-medium bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 max-w-xs animate-pulse">
              <Sparkles size={15} className="animate-spin text-emerald-600" />
              <span>Gemini AI Agronomist ayaa jawaabta falanqeynaya…</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 pt-2 pb-2 px-3 bg-[#FAFAFA] border-t border-gray-200 z-20">
          <ChatInput
            onSendMessage={handleSendMessage}
            onToggleVision={() => setIsVisionOpen((prev) => !prev)}
            isVisionOpen={isVisionOpen}
            disabled={isThinking}
          />
        </div>
      </div>
    </div>
  )
}
