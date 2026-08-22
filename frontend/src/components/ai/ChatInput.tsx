import { useState, type KeyboardEvent, type ChangeEvent } from 'react'
import { ArrowUp, Plus, Image as ImageIcon, Sparkles } from 'lucide-react'
import { AttachmentMenu } from '@/components/ai/AttachmentMenu'
import { cn } from '@/lib/cn'
import type { ChatInputProps } from '@/types'

export function ChatInput({
  onSendMessage,
  onToggleVision,
  isVisionOpen,
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleSend() {
    const trimmed = text.trim()
    if (trimmed && !disabled) {
      onSendMessage(trimmed)
      setText('')
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
  }

  function handleSelectAttachment(id: string) {
    if (id === 'upload' || id === 'camera' || id === 'sample') {
      onToggleVision()
    }
  }

  const canSend = text.trim().length > 0 && !disabled

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs focus-within:border-gray-400 transition-colors">
      {/* Upward attachment dropdown popover */}
      {isMenuOpen && (
        <AttachmentMenu
          onSelect={handleSelectAttachment}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* Input Row */}
      <div className="flex items-start gap-2">
        {/* Plus Button for Attachments */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={cn(
            'p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer mt-0.5',
            isMenuOpen && 'bg-gray-100 text-gray-900'
          )}
          title="Add attachment (Drive, Upload, Camera, Audio…)"
          aria-label="Add attachment"
        >
          <Plus size={18} className={cn('transition-transform duration-150', isMenuOpen && 'rotate-45')} />
        </button>

        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask AgriSmart AI about crop diseases, soil moisture, or fertilizer schedules…"
          rows={2}
          disabled={disabled}
          className="w-full resize-none bg-transparent outline-none text-xs text-gray-900 placeholder-gray-400 px-1 py-1 min-h-[44px]"
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 px-1 mt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleVision}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
              isVisionOpen
                ? 'bg-gray-100 text-gray-900 border border-gray-300'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-200/80'
            )}
            title="Attach crop photo for Vision AI diagnosis"
          >
            <ImageIcon size={13} className={isVisionOpen ? 'text-gray-900' : 'text-gray-400'} />
            <span className="hidden sm:inline">Vision AI</span>
          </button>

          <span className="text-[11px] text-gray-400 hidden md:inline-flex items-center gap-1">
            <Sparkles size={11} className="text-gray-400" /> Somali LLM
          </span>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center',
            canSend
              ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-2xs'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
          title="Send message"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  )
}
