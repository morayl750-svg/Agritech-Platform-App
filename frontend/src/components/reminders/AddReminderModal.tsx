import { useState } from 'react'
import {
  X,
  Bell,
  Droplets,
  Sprout,
  AlertTriangle,
  Syringe,
  FlaskConical,
  PlusCircle,
  Calendar,
  MapPin,
} from 'lucide-react'
import type { FarmerReminder, ReminderCategory, ReminderUrgency } from '@/types/reminders'

interface AddReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onAddReminder: (reminder: Omit<FarmerReminder, 'id' | 'created_at' | 'isDone'>) => void
}

export function AddReminderModal({ isOpen, onClose, onAddReminder }: AddReminderModalProps) {
  const [category, setCategory] = useState<ReminderCategory>('irrigation')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<ReminderUrgency>('warning')
  const [target, setTarget] = useState('Plot #1 — Beerta')
  const [dueDate, setDueDate] = useState('Maanta 05:30 PM')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddReminder({
      category,
      title: title.trim(),
      description: description.trim() || 'Xusuusin beeraley ah.',
      urgency,
      target: target.trim() || 'Beerta',
      dueDate: dueDate.trim() || 'Hadda',
    })

    // Reset form
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Kee Dar Xusuusin Cusub</h2>
              <p className="text-xs text-gray-500">Xasuusinta waraabka, goosashada ama talaalka</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Qeybta Xusuusinta (Category)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('irrigation')
                  setTitle('Waqtiga Waraabka Beerta')
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  category === 'irrigation'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Droplets size={14} className="text-blue-600" />
                <span>Waraabka</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('harvest')
                  setTitle('Xilliga Goosashada Dalagga')
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  category === 'harvest'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sprout size={14} className="text-amber-600" />
                <span>Goosashada</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('weather_alert')
                  setTitle('Digniinta Cimilada Halista ah')
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  category === 'weather_alert'
                    ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <AlertTriangle size={14} className="text-red-600" />
                <span>Cimilada</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('vaccination')
                  setTitle('Talaalka Xoolaha')
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  category === 'vaccination'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Syringe size={14} className="text-emerald-600" />
                <span>Talaalka</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('fertilizer')
                  setTitle('Bacriminta Carrada')
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  category === 'fertilizer'
                    ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FlaskConical size={14} className="text-purple-600" />
                <span>Bacriminta</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Cinwaanka Xusuusinta (Title)
            </label>
            <input
              type="text"
              required
              placeholder="E.g. Waraabi Plot #2 ama Goosashada Galleyda"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Faaahfaahin (Details)
            </label>
            <textarea
              rows={2}
              placeholder="Qrifo ama farriin faahfaahsan oo ku saabsan xusuusintan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Target & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Bar-tilmaameedka (Target Crop/Plot)
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Plot #1 — Galleyda"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Waqtiga & Taariikhda (Due Date)
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Maanta 05:30 PM"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Heerka Halista / Muhiimadda (Urgency)
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as ReminderUrgency)}
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              <option value="emergency">🚨 Degdeg (Emergency Alert)</option>
              <option value="warning">⚠️ Digniin (Warning / High Priority)</option>
              <option value="normal">📌 Caadi (Normal Priority)</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Kansal (Cancel)
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Kaydi Xusuusinta (Save)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
