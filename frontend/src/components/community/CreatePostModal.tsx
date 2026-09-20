import { useState, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CreatePostModalProps, PostCategory } from '@/types/community'

export function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('Amina Barre')
  const [category, setCategory] = useState<Exclude<PostCategory, 'All'>>('General')
  const [content, setContent] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!title.trim()) throw new Error('Post title is required')
      if (!content.trim()) throw new Error('Post content description is required')

      const { error: err } = await supabase.from('posts').insert([
        {
          title: title.trim(),
          content: content.trim(),
          author_name: authorName.trim() || 'Anonymous Farmer',
          category,
          upvotes: 1,
          replies_count: 0,
        },
      ])

      if (err) throw err

      onSuccess()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to publish post'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Create Community Post</h2>
            <p className="text-xs text-gray-500 mt-0.5">Share advisory or ask questions with Somali farmers.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Post Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Best fertilizer schedule for rain-fed Sorghum?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<PostCategory, 'All'>)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
              >
                <option value="General">General</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Market Prices">Market Prices</option>
                <option value="Weather">Weather</option>
                <option value="Livestock">Livestock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your Name / Handle</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Content & Details</label>
            <textarea
              rows={4}
              required
              placeholder="Describe your question, observation, or market price update..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
