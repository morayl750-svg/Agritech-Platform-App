export type PostCategory = 'All' | 'Pest Control' | 'Market Prices' | 'Weather' | 'Livestock' | 'General'

export interface CommunityPost {
  id: string
  title: string
  content: string
  author_name: string
  category: Exclude<PostCategory, 'All'>
  upvotes: number
  replies_count: number
  created_at: string
}

export interface PostCardProps {
  post: CommunityPost
  onUpvote: (id: string, currentUpvotes: number) => void
}

export interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
