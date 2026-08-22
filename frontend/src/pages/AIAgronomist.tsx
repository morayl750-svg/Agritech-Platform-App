import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Bot } from 'lucide-react'
import { ChatHeader } from '@/components/ai/ChatHeader'
import { ChatMessage } from '@/components/ai/ChatMessage'
import { ChatInput } from '@/components/ai/ChatInput'
import { VisionUploader } from '@/components/ai/VisionUploader'
import { ChatHistorySidebar } from '@/components/ai/ChatHistorySidebar'
import { useChatHistory } from '@/hooks/useChatHistory'
import { askAI } from '@/lib/api'
import type { ChatMessageItem } from '@/types'

export default function AIAgronomist() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [isVisionOpen, setIsVisionOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const { createSession, fetchSessionMessages, saveMessage } = useChatHistory()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadSessionMessages = useCallback(
    async (id: string) => {
      const fetched = await fetchSessionMessages(id)
      setMessages(fetched)
    },
    [fetchSessionMessages]
  )

  useEffect(() => {
    if (activeChatId) {
      loadSessionMessages(activeChatId)
    } else {
      setMessages([])
    }
  }, [activeChatId, loadSessionMessages])

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
    <div className="flex flex-row h-full w-full relative overflow-hidden">
      <ChatHistorySidebar
        isOpen={isHistoryOpen}
        activeChatId={activeChatId || ''}
        onSelectChat={setActiveChatId}
        onNewChat={() => {
          setMessages([])
          setActiveChatId(null)
        }}
      />

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

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Bot size={36} className="text-gray-800 mb-2 opacity-90" />
              <h3 className="text-sm font-semibold text-gray-900">Start an AI Consultation</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Ask about crop health, irrigation schedules, or attach a photo for pest diagnosis.
              </p>
            </div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}

          {isThinking && (
            <div className="flex items-center gap-2 my-2 text-xs text-gray-700 font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-200 max-w-xs">
              <Sparkles size={14} className="animate-spin text-gray-600" />
              Gemini AI analyzing field data…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 pt-2 pb-1 bg-[#FAFAFA] border-t border-gray-100 z-20">
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
