import { Sparkles, Trash2, Bot, PanelLeft } from 'lucide-react'

interface ChatHeaderProps {
  isHistoryOpen: boolean
  onToggleHistory: () => void
  onClearChat: () => void
}

export function ChatHeader({ isHistoryOpen, onToggleHistory, onClearChat }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between py-2 mb-2 border-b border-gray-200 bg-[#FAFAFA] z-10">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleHistory}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer mr-0.5"
          title={isHistoryOpen ? 'Hide history sidebar' : 'Show history sidebar'}
          aria-label="Toggle history sidebar"
        >
          <PanelLeft size={18} />
        </button>

        <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
          <Bot size={18} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            AI Agronomist
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
              <Sparkles size={10} className="text-gray-500" /> Live Gemini AI
            </span>
          </h1>
          <p className="text-xs text-gray-500">Somali Agricultural Intelligence & Crop Vision AI</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearChat}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        title="Clear current view"
      >
        <Trash2 size={13} /> Clear
      </button>
    </div>
  )
}
