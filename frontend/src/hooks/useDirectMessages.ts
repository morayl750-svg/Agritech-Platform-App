import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface DirectMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_role: 'buyer' | 'seller'
  content: string
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  product_id: string | null
  buyer_name: string
  seller_name: string
  buyer_id: string
  seller_id: string
  last_message: string | null
  last_message_at: string | null
  created_at: string
}

export function useDirectMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [loading, setLoading] = useState(false)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    setLoading(true)

    // Load existing messages
    supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setMessages(data)
        }
        setLoading(false)
      })

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as DirectMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string, senderName: string, senderRole: 'buyer' | 'seller', senderId?: string) => {
      if (!conversationId || !content.trim()) return

      const cleanText = content.trim()
      const sId = senderId || `${senderRole}-${Date.now()}`

      // Optimistic message
      const tempId = `temp-${Date.now()}`
      const optimisticMsg: DirectMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: sId,
        sender_name: senderName,
        sender_role: senderRole,
        content: cleanText,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, optimisticMsg])

      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sId,
          sender_name: senderName,
          sender_role: senderRole,
          content: cleanText,
        })
        .select()
        .single()

      if (!error && data) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? (data as DirectMessage) : m)))
        await supabase
          .from('conversations')
          .update({
            last_message: cleanText,
            last_message_at: new Date().toISOString(),
          })
          .eq('id', conversationId)
      }

      return error
    },
    [conversationId]
  )

  return { messages, loading, sendMessage }
}

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (data && data.length > 0) {
      setConversations(data)
    } else {
      // Sample mock conversation if database table is fresh
      setConversations([
        {
          id: 'conv-sample-1',
          product_id: null,
          buyer_name: 'Jaamac Warsame',
          seller_name: 'Amina Barre (Beeraley)',
          buyer_id: userId,
          seller_id: 'farmer-01',
          last_message: 'Asc beeraley, xilligee ayay galleydu soo go’aysaa?',
          last_message_at: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'conv-sample-2',
          product_id: null,
          buyer_name: 'Foosiyo Agro',
          seller_name: 'Mohamed Xasan',
          buyer_id: userId,
          seller_id: 'farmer-02',
          last_message: 'Mooska 5 kartoon ayaan u baahanahay berri.',
          last_message_at: new Date(Date.now() - 7200000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const startConversation = async (
    productId: string | null,
    buyerName: string,
    sellerName: string,
    sellerId: string = 'farmer-default'
  ): Promise<string | null> => {
    const buyerId = userId || `buyer-${Date.now()}`

    // Check existing
    if (productId) {
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', buyerId)
        .maybeSingle()

      if (existing) return existing.id
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        product_id: productId,
        buyer_name: buyerName,
        seller_name: sellerName,
        buyer_id: buyerId,
        seller_id: sellerId,
        last_message: 'Wadahadalka waa la bilaabay.',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!error && data) {
      setConversations((prev) => [data as Conversation, ...prev])
      return data.id
    }

    return null
  }

  return { conversations, loading, reload: loadConversations, startConversation }
}
