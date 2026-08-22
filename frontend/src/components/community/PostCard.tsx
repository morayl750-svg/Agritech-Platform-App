import { ChevronUp, MessageSquare, User } from 'lucide-react'
import type { PostCardProps } from '@/types/community'

function formatTimeAgo(isoString: string): string {
  if (!isoString) return 'Just now'
  const date = new Date(isoString)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function PostCard({ post, onUpvote }: PostCardProps) {
  return (
    <div className="w-full flex items-start gap-3.5 py-4 border-b border-gray-100 hover:bg-gray-50/60 px-3 rounded-xl transition-colors group">
      {/* Upvote Button / Counter */}
      <button
        type="button"
        onClick={() => onUpvote(post.id, post.upvotes)}
        className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 hover:border-gray-300 text-gray-700 flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0 shadow-2xs group-hover:border-gray-300"
        title="Upvote post"
      >
        <ChevronUp size={16} className="text-gray-500 group-hover:text-gray-900" />
        <span className="text-xs font-semibold text-gray-900">{post.upvotes}</span>
      </button>

      {/* Middle Post Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors leading-snug">
          {post.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {post.content}
        </p>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <User size={12} className="text-gray-400" />
            {post.author_name}
          </span>
          <span>•</span>
          <span>{formatTimeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Right Side Category & Replies */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {post.category}
        </span>

        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
          <MessageSquare size={13} className="text-gray-400" />
          <span>{post.replies_count}</span>
        </div>
      </div>
    </div>
  )
}
