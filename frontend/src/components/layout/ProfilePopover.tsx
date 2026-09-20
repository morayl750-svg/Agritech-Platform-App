import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, KeyRound, Check, ChevronRight, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { UserProfile } from '@/types/auth'

interface ProfilePopoverProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
}

export function ProfilePopover({ isOpen, onClose, isCollapsed = false }: ProfilePopoverProps) {
  const navigate = useNavigate()
  const { user, allUsers, switchUser, logout } = useAuth()
  const [isSwitching, setIsSwitching] = useState(false)

  if (!isOpen) return null

  function handleNavigate(path: string) {
    navigate(path)
    onClose()
  }

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate('/login')
  }

  const handleSelectUser = (u: UserProfile) => {
    switchUser(u)
    setIsSwitching(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      <div
        className={`absolute bottom-full mb-2 bg-white border border-gray-200 shadow-xl rounded-2xl py-1.5 z-50 transition-all overflow-hidden ${
          isCollapsed ? 'left-12 w-64' : 'left-0 right-0 w-full'
        }`}
      >
        {!isSwitching ? (
          <>
            {/* Active User Header */}
            <div className="px-3.5 py-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {user?.full_name || 'AgriSmart User'}
                </p>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                    user?.role === 'Admin'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {user?.role === 'Admin' ? 'Admin' : 'User (Macmiil)'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email || 'user@agrismart.so'}</p>
              {user?.username && (
                <p className="text-[10px] text-emerald-700 font-mono mt-0.5 truncate">
                  @{user.username}
                </p>
              )}
            </div>

            {/* Menu Links */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <User size={14} className="text-gray-400" />
                <span>Profile-kaaga (My Profile)</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('/settings')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Settings size={14} className="text-gray-400" />
                <span>Habeynta (Settings)</span>
              </button>

              {/* Switch User Trigger */}
              <button
                type="button"
                onClick={() => setIsSwitching(true)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound size={14} className="text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Bedel Isticmaalaha (Switch User)</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            </div>

            <div className="pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={14} className="text-red-500" />
                <span>Ka bax nidaamka (Log out)</span>
              </button>
            </div>
          </>
        ) : (
          /* USER SWITCHER SUB-MENU */
          <div className="p-1 space-y-1">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Dooro Isticmaalaha:</span>
              <button
                type="button"
                onClick={() => setIsSwitching(false)}
                className="text-[11px] text-gray-400 hover:text-gray-700 cursor-pointer font-medium"
              >
                ← Ka noqo
              </button>
            </div>

            {/* List of Users */}
            <div className="max-h-56 overflow-y-auto space-y-1 py-1">
              {allUsers.map((u) => {
                const isActive = user?.id === u.id || user?.email === u.email
                const initials = u.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gray-900 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold truncate">{u.full_name}</p>
                          <span
                            className={`text-[8px] font-bold px-1 rounded ${
                              u.role === 'Admin'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {u.role === 'Admin' ? 'Admin' : 'User'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">@{u.username}</p>
                      </div>
                    </div>

                    {isActive && <Check size={14} className="text-emerald-600 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Register New User Action */}
            <div className="pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/signup')
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition-all cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Sameey Koonto Cusub (Add User)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
