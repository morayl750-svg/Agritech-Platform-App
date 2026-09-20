import { useState } from 'react'
import { Plus, Search, MessageSquare } from 'lucide-react'
import { PostCard } from '@/components/community/PostCard'
import { CreatePostModal } from '@/components/community/CreatePostModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCommunityPosts } from '@/hooks/useCommunityPosts'
import { cn } from '@/lib/cn'
import type { PostCategory } from '@/types/community'

const CATEGORIES: PostCategory[] = [
  'All',
  'Pest Control',
  'Market Prices',
  'Weather',
  'Livestock',
  'General',
]

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { posts, isLoading, refetch, upvotePost } = useCommunityPosts(
    selectedCategory,
    searchQuery
  )

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Farmer Community</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Peer-to-peer knowledge sharing, pest alerts & market updates for Somali farmers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Post</span>
        </button>
      </div>

      {/* Search & Category Pills Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Main Forum List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-100">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
            <MessageSquare size={32} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-800">No community posts found</p>
            <p className="text-xs text-gray-500 mt-1">Be the first to share a question or market update.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpvote={upvotePost} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  )
}
