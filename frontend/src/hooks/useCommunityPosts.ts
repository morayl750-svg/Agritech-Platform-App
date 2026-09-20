import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CommunityPost, PostCategory } from '@/types/community'

const DEMO_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author_name: 'Cali Abdi (Beeraley Afgooye)',
    title: 'Dawaynta Cayayaanka Ayaya ee Galayda – Talooyinka Beeraleyda Afgooye',
    content:
      'Asc beeraleyda Shabelle! Sanadkan waxaan isticmaalnay saliidda Neemo-da oo la buufiyay 3-dii maalmoodba mara aroortii hore. Cayayaankii ayaya ayaa 80% hoos u dhacay. Sidoo kale ha iloobina in aad beerta nadiif ka dhigtaan.',
    category: 'Pest Control',
    upvotes: 24,
    replies_count: 8,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'post-2',
    author_name: 'Foosiyo Hassan (Agronomist)',
    title: "Faa'iidada Waraabka Dhibicda (Drip Irrigation) ee Xilliga Jiilaalka",
    content:
      'Waraabka dhibicdu wuxuu badbaadiyaa biyaha 60%. Beertayda Shabelle Hoose waxaan kordhinay soosaarka khadarta 35% maadaama biyuhu si toos ah ugu dhacayaan xididka dhirta.',
    category: 'General',
    upvotes: 38,
    replies_count: 14,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'post-3',
    author_name: 'Dr. Omar Jama (Dhakhtar Xoolaha)',
    title: 'Tallaalka Xoolaha ka hor Roobka Ganaayga (Cudurada Xoolaha)',
    content:
      "Dhiqluhu iyo kantiidku waxay kordhaan marka roobabku bilaabdaan. Waxaan ku talinaynaa in geela iyo lo'da la tallaalo 2 toddobaad ka hor roobabka si looga hortago Ganaasha iyo cudurada dhiig-yarida.",
    category: 'Livestock',
    upvotes: 42,
    replies_count: 19,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'post-4',
    author_name: 'Amina Barre (Admin)',
    title: 'Sayladda & Suuqgeynta Dalagyada Sisinta Shabelle',
    content:
      'Qiimaha sisinta cad ee suuqa Mogadishu & Afgooye waa $18/5kg halka ganacsatada dhoofintu ay ku iibsanayaan qiimo wanaagsan. Beeraleydu waa in ay hubiyaan qalajinta sisinta ka hor inta aysan suuqa keenin.',
    category: 'Market Prices',
    upvotes: 31,
    replies_count: 11,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
]

export function useCommunityPosts(
  selectedCategory: PostCategory = 'All',
  searchQuery: string = ''
) {
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_POSTS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (supabase) {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false })

        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory)
        }

        if (searchQuery.trim()) {
          query = query.or(
            `title.ilike.%${searchQuery.trim()}%,content.ilike.%${searchQuery.trim()}%`
          )
        }

        const res = await query
        const data = res?.data

        if (Array.isArray(data) && data.length > 0) {
          setPosts(data as CommunityPost[])
          setIsLoading(false)
          return
        }
      }

      // Fallback filtering on DEMO_POSTS
      let filtered = [...DEMO_POSTS]
      if (selectedCategory !== 'All') {
        filtered = filtered.filter((p) => p.category === selectedCategory)
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
        )
      }
      setPosts(filtered)
    } catch (err) {
      console.warn('[Community Posts Fetch Warning]', err)
      setPosts(DEMO_POSTS)
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
      if (supabase) {
        await supabase.from('posts').update({ upvotes: newCount }).eq('id', id)
      }
    } catch (err) {
      console.warn('[Supabase Upvote Warning]', err)
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
