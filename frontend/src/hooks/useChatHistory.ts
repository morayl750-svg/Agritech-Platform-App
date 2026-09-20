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

// SAMPLE DEMO CHAT HISTORY SESSIONS
const DEMO_SESSIONS: ChatHistoryItem[] = [
  {
    id: 'demo-chat-1',
    title: 'Cudurada Galayda & Ayaya (Afgooye)',
    date: 'Today',
  },
  {
    id: 'demo-chat-2',
    title: 'Jadwalka Waraabka Sisinta',
    date: 'Yesterday',
  },
  {
    id: 'demo-chat-3',
    title: 'Talooyinka Caafimaadka Geela',
    date: '2 days ago',
  },
]

// SAMPLE DEMO MESSAGES FOR EACH SESSION
const DEMO_MESSAGES: Record<string, ChatMessageItem[]> = {
  'demo-chat-1': [
    {
      id: 'msg-1-1',
      sender: 'user',
      text: 'Sida loo daweeyo cayayaanka galayda ku dhaca ee Afgooye?',
      timestamp: '09:15 AM',
    },
    {
      id: 'msg-1-2',
      sender: 'ai',
      text: `Asc Nabad iyo Raxmad beeraley! Galayda gobolka Shabelle Hoose (Afgooye sector) waxay inta badan la kulantaa Ayaya (Fall Armyworm). Hababka ugu habboon ee looga hortago:

1. **Baaritaan Joogto ah**: Hubi caleemaha burooyinkeeda maalin kasta aroortii hore.
2. **Saliidda Neemo-da (Neem Oil)**: Buufi saliidda neem-ka oo lagu qasay biyo diirran (2ml/Litr) aroortii ama fiidkii.
3. **Bacillus thuringiensis (Bt)**: Isticmaal sunta dabiiciga ah ee Bt haddii cayayaanku ku batay beerta.
4. **Waraabka Xilliga ku habboon**: Hubi in carrada ay leedahay qoyaan ku filan xilliga caleentu cusub tahay.`,
      timestamp: '09:16 AM',
    },
  ],
  'demo-chat-2': [
    {
      id: 'msg-2-1',
      sender: 'user',
      text: 'Kuleylka 34°C ee maanta, meeqa jeer ayaan waraabiyaa dalaga Sisinta (Sesame)?',
      timestamp: '02:30 PM',
    },
    {
      id: 'msg-2-2',
      sender: 'ai',
      text: `Sisinta (Sesame) waa dalag adkaysta kuleylka, laakiin xilliga ubaxa iyo mimiraynta waxay u baahan tahay daryeel dhow:

• **Tirada Waraabka**: Waraabi 3-dii ilaa 4 maalmoodba hal mara xilliga kuleylku ka sarreeyo 32°C.
• **Waqtiga Waraabka**: Waraabi 6:00 AM - 8:00 AM ama marka qorraxdu dhacdo ka dib si looga hortago in biyuhu bốc-baxaan (evaporate).
• **Ilaalinta Carrada**: Hubi in biyuhu aysan ku fariisan xididada si looga hortago kaarida (root rot).`,
      timestamp: '02:31 PM',
    },
  ],
  'demo-chat-3': [
    {
      id: 'msg-3-1',
      sender: 'user',
      text: 'Geela calaamadaha daalka iyo cuntada ka joogsiga qaba maxaa lagu daweeyaa?',
      timestamp: '11:00 AM',
    },
    {
      id: 'msg-3-2',
      sender: 'ai',
      text: `Asc! Geela marka uu muujiyo daal, cuntada ka joogsi iyo caato oo ku soo korarta, waxay inta badan calaamad u tahay cudurka **Ganaasha (Trypanosomiasis/Surra)** oo dhiqluhu ama tsetse fly ay gudbiyaan.

**Talooyinka:**
1. **Dawooyinka:** Isticmaal *Quinapyramine sulfate* ama *Diminazene aceturate (Beneril)* oo uu bixiyo dhakhtarka xoolaha.
2. **Fitamiinada:** Sii fitamiin B-complex iyo Iron injektion si uu dhiiggu kor ugu kaco.
3. **Nadiifinta Harraaga:** Ka fogaaw meelaha biyaha calalinta ah oo kantiidka ama dhiqluhu ku badan yihiin.`,
      timestamp: '11:02 AM',
    },
  ],
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatHistoryItem[]>(DEMO_SESSIONS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (supabase) {
        const res = await supabase
          .from('chat_sessions')
          .select('*')
          .order('created_at', { ascending: false })

        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          const mappedSessions: ChatHistoryItem[] = (data as DbChatSession[]).map((session) => ({
            id: session.id,
            title: session.title,
            date: formatRelativeDate(session.created_at),
          }))
          setSessions([...mappedSessions, ...DEMO_SESSIONS])
          setIsLoading(false)
          return
        }
      }
      // If no remote sessions, fallback to demo sessions
      setSessions(DEMO_SESSIONS)
    } catch (err) {
      console.warn('[Chat History Warning]', err)
      setSessions(DEMO_SESSIONS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const createSession = useCallback(async (title: string): Promise<string | null> => {
    try {
      if (supabase) {
        const res = await supabase
          .from('chat_sessions')
          .insert([{ title }])
          .select()
          .single()

        const data = res?.data
        if (data) {
          const newSession: ChatHistoryItem = {
            id: data.id,
            title: data.title,
            date: 'Just now',
          }
          setSessions((prev) => [newSession, ...prev])
          return data.id
        }
      }
    } catch (err) {
      console.warn('[Chat Session Create Warning]', err)
    }

    // Local fallback session creation
    const localId = `session-${Date.now()}`
    const localSession: ChatHistoryItem = {
      id: localId,
      title,
      date: 'Just now',
    }
    setSessions((prev) => [localSession, ...prev])
    return localId
  }, [])

  const fetchSessionMessages = useCallback(async (sessionId: string): Promise<ChatMessageItem[]> => {
    // Check demo messages first
    if (DEMO_MESSAGES[sessionId]) {
      return DEMO_MESSAGES[sessionId]
    }

    try {
      if (supabase) {
        const res = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
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
      }
    } catch (err) {
      console.warn('[Chat Messages Fetch Warning]', err)
    }
    return []
  }, [])

  const saveMessage = useCallback(
    async (sessionId: string, role: 'user' | 'ai' | 'model', content: string) => {
      // If it's a demo session, save locally in memory
      if (DEMO_MESSAGES[sessionId]) {
        DEMO_MESSAGES[sessionId].push({
          id: `msg-${Date.now()}`,
          sender: role === 'user' ? 'user' : 'ai',
          text: content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
        return
      }

      try {
        if (supabase) {
          await supabase.from('chat_messages').insert([
            {
              session_id: sessionId,
              role,
              content,
            },
          ])
        }
      } catch (err) {
        console.warn('[Chat Message Save Warning]', err)
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
