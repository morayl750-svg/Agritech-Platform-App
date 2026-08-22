import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CommunityPost, PostCategory } from '@/types/community'

export function useCommunityPosts(
  selectedCategory: PostCategory = 'All',
  searchQuery: string = ''
) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery.trim()}%,content.ilike.%${searchQuery.trim()}%`
        )
      }

      const { data, error: err } = await query

      if (err) throw err

      if (data) {
        setPosts(data as CommunityPost[])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch community posts'
      console.warn('[Supabase Posts Fetch Error]', msg)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const upvotePost = useCallback(async (id: string, currentUpvotes: number) => {
    const newCount = currentUpvotes + 1

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: newCount } : p))
    )

    try {
      const { error: err } = await supabase
        .from('posts')
        .update({ upvotes: newCount })
        .eq('id', id)

      if (err) throw err
    } catch (err) {
      console.warn('[Supabase Upvote Error]', err)
    }
  }, [])

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts,
    upvotePost,
  }
}
