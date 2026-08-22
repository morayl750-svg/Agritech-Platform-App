import { useState, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  setName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  region: string
  setRegion: (val: string) => void
  farmSize: string
  setFarmSize: (val: string) => void
}

export function EditProfileModal({
  isOpen,
  onClose,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  region,
  setRegion,
  farmSize,
  setFarmSize,
}: EditProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  function handleSave(e: FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-semibold text-gray-900">Edit Profile Information</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
            <input
              type="text"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Farm Scale & Crops</label>
            <input
              type="text"
              required
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-1 cursor-pointer"
            >
              {isSaving && <Loader2 size={12} className="animate-spin" />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
