import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ChatHistoryItem, ChatMessageItem, DbChatSession } from '@/types'

function formatRelativeDate(isoString: string): string {
  if (!isoString) return 'Recently'
  const date = new Date(isoString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return 'Last week'
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      if (data) {
        const mappedSessions: ChatHistoryItem[] = (data as DbChatSession[]).map((session) => ({
          id: session.id,
          title: session.title,
          date: formatRelativeDate(session.created_at),
        }))
        setSessions(mappedSessions)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch chat history'
      console.warn('[Supabase Fetch Error]', msg)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const createSession = useCallback(async (title: string): Promise<string | null> => {
    try {
      const { data, error: err } = await supabase
        .from('chat_sessions')
        .insert([{ title }])
        .select()
        .single()

      if (err) {
        console.error('[Supabase Session Create Error Details]', {
          code: err.code,
          message: err.message,
          details: err.details,
          hint: err.hint,
        })
        throw err
      }

      if (data) {
        const newSession: ChatHistoryItem = {
          id: data.id,
          title: data.title,
          date: 'Just now',
        }
        setSessions((prev) => [newSession, ...prev])
        return data.id
      }
    } catch (err) {
      console.error('[Supabase Session Create Error]', err)
    }
    return null
  }, [])

  const fetchSessionMessages = useCallback(async (sessionId: string): Promise<ChatMessageItem[]> => {
    try {
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (err) throw err

      if (data) {
        return data.map((msg) => ({
          id: msg.id,
          sender: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
      }
    } catch (err) {
      console.error('[Supabase Messages Fetch Error]', err)
    }
    return []
  }, [])

  const saveMessage = useCallback(
    async (sessionId: string, role: 'user' | 'ai' | 'model', content: string) => {
      try {
        const { error: err } = await supabase.from('chat_messages').insert([
          {
            session_id: sessionId,
            role,
            content,
          },
        ])
        if (err) {
          console.error('[Supabase Message Save Error Details]', err)
        }
      } catch (err) {
        console.error('[Supabase Message Save Error]', err)
      }
    },
    []
  )

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchHistory,
    createSession,
    fetchSessionMessages,
    saveMessage,
  }
}
