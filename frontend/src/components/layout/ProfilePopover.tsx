import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut } from 'lucide-react'

interface ProfilePopoverProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
}

export function ProfilePopover({ isOpen, onClose, isCollapsed = false }: ProfilePopoverProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  function handleNavigate(path: string) {
    navigate(path)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      <div
        className={`absolute bottom-full mb-2 bg-white border border-gray-200 shadow-xl rounded-xl py-1.5 z-50 transition-all ${
          isCollapsed ? 'left-12 w-48' : 'left-0 right-0 w-full'
        }`}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-900 truncate">Amina Barre</p>
          <p className="text-[10px] text-gray-400 truncate">amina.barre@agrismart.so</p>
        </div>

        <div className="py-1">
          <button
            type="button"
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <User size={14} className="text-gray-400" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Settings size={14} className="text-gray-400" />
            <span>Settings</span>
          </button>
        </div>

        <div className="pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={14} className="text-red-500" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  )
}
