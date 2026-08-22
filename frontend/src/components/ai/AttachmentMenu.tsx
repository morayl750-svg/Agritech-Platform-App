import { HardDrive, Upload, Mic, Camera, Video, Image as ImageIcon } from 'lucide-react'
import type { AttachmentMenuItem, AttachmentMenuProps } from '@/types'

const ATTACHMENT_ITEMS: AttachmentMenuItem[] = [
  { id: 'drive', label: 'Drive', icon: HardDrive, iconColor: 'text-blue-500' },
  { id: 'upload', label: 'Upload files', icon: Upload, iconColor: 'text-emerald-600' },
  { id: 'audio', label: 'Record Audio', icon: Mic, iconColor: 'text-rose-500' },
  { id: 'camera', label: 'Camera', icon: Camera, iconColor: 'text-purple-500' },
  { id: 'youtube', label: 'YouTube Video', icon: Video, iconColor: 'text-red-600' },
  { id: 'sample', label: 'Sample Media', icon: ImageIcon, iconColor: 'text-amber-500' },
]

export function AttachmentMenu({ onSelect, onClose }: AttachmentMenuProps) {
  return (
    <>
      {/* Invisible backdrop to dismiss menu on click outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      {/* Upward popover menu */}
      <div className="absolute bottom-full mb-2 left-0 z-50 w-56 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
          Add Attachment
        </div>
        <div className="flex flex-col gap-0.5">
          {ATTACHMENT_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id)
                  onClose()
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors text-left cursor-pointer"
              >
                <div className="p-1 rounded-md bg-gray-50 flex items-center justify-center">
                  <Icon size={15} className={item.iconColor} aria-hidden="true" />
                </div>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
