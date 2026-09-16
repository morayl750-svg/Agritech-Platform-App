import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  Droplets,
  Sprout,
  AlertTriangle,
  Syringe,
  FlaskConical,
  CheckCircle2,
  Plus,
  Trash2,
  X,
  ShieldAlert,
} from 'lucide-react'
import type { FarmerReminder, ReminderCategory } from '@/types/reminders'
import {
  getReminders,
  addReminder,
  toggleReminderDone,
  deleteReminder,
} from '@/services/reminderService'
import { AddReminderModal } from './AddReminderModal'
import { cn } from '@/lib/cn'

export function RemindersPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [reminders, setReminders] = useState<FarmerReminder[]>(() => getReminders())
  const [filter, setFilter] = useState<'all' | 'alert' | 'irrigation' | 'harvest'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeRemindersCount = reminders.filter((r) => !r.isDone).length
  const emergencyAlertsCount = reminders.filter((r) => r.urgency === 'emergency' && !r.isDone).length

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'alert') return r.category === 'weather_alert' || r.urgency === 'emergency'
    if (filter === 'irrigation') return r.category === 'irrigation'
    if (filter === 'harvest') return r.category === 'harvest'
    return true
  })

  const handleToggleDone = (id: string) => {
    const updated = toggleReminderDone(id)
    setReminders(updated)
  }

  const handleDelete = (id: string) => {
    const updated = deleteReminder(id)
    setReminders(updated)
  }

  const handleAdd = (rem: Omit<FarmerReminder, 'id' | 'created_at' | 'isDone'>) => {
    addReminder(rem)
    setReminders(getReminders())
  }

  const getCategoryIcon = (cat: ReminderCategory, className = 'w-4 h-4') => {
    switch (cat) {
      case 'irrigation':
        return <Droplets className={cn('text-blue-500', className)} />
      case 'harvest':
        return <Sprout className={cn('text-amber-500', className)} />
      case 'weather_alert':
        return <AlertTriangle className={cn('text-red-500', className)} />
      case 'vaccination':
        return <Syringe className={cn('text-emerald-500', className)} />
      case 'fertilizer':
        return <FlaskConical className={cn('text-purple-500', className)} />
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`View farmer reminders & weather alerts — ${activeRemindersCount} active`}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Bell size={17} />
        {activeRemindersCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-2xs">
            {activeRemindersCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Bell size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Xusuusinta & Digniinaha</h3>
                <p className="text-[10px] text-gray-500">Waraabka, Goosashada & Cimilada</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2 flex items-center gap-1 transition-colors cursor-pointer"
                title="Add new reminder"
              >
                <Plus size={12} />
                <span>Cusub</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Emergency Alert Header Banner if Emergency Exists */}
          {emergencyAlertsCount > 0 && (
            <div className="bg-red-50 border-b border-red-100 p-2.5 px-4 flex items-center gap-2 text-red-800 text-[11px] font-semibold">
              <ShieldAlert size={15} className="text-red-600 flex-shrink-0 animate-pulse" />
              <span>Digniin Degdeg ah oo cimilada halista ah ayaa jirta!</span>
            </div>
          )}

          {/* Filter Pills */}
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1 overflow-x-auto text-[11px] font-medium bg-white">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-colors cursor-pointer',
                filter === 'all'
                  ? 'bg-gray-900 text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Dhamaan ({reminders.length})
            </button>

            <button
              onClick={() => setFilter('alert')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-colors cursor-pointer',
                filter === 'alert'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-red-600 hover:bg-red-50'
              )}
            >
              ⚠️ Digniinaha
            </button>

            <button
              onClick={() => setFilter('irrigation')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-colors cursor-pointer',
                filter === 'irrigation'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-blue-600 hover:bg-blue-50'
              )}
            >
              💧 Waraabka
            </button>

            <button
              onClick={() => setFilter('harvest')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-colors cursor-pointer',
                filter === 'harvest'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-amber-600 hover:bg-amber-50'
              )}
            >
              🌾 Goosashada
            </button>
          </div>

          {/* Reminders List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
            {filteredReminders.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">
                Xusuusino ma jiraan qaybtan.
              </div>
            ) : (
              filteredReminders.map((rem) => (
                <div
                  key={rem.id}
                  className={cn(
                    'p-3 rounded-xl transition-all flex items-start justify-between gap-3',
                    rem.isDone
                      ? 'bg-gray-50 opacity-60'
                      : rem.urgency === 'emergency'
                      ? 'bg-red-50/60 border border-red-200/80'
                      : 'bg-white hover:bg-gray-50 border border-transparent'
                  )}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {getCategoryIcon(rem.category)}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className={cn(
                            'text-xs font-bold truncate',
                            rem.isDone ? 'line-through text-gray-400' : 'text-gray-900'
                          )}
                        >
                          {rem.title}
                        </h4>

                        {rem.urgency === 'emergency' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700 border border-red-200">
                            Degdeg
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                        {rem.description}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-1 font-medium">
                        <span>📍 {rem.target}</span>
                        <span>•</span>
                        <span>⏰ {rem.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleDone(rem.id)}
                      className={cn(
                        'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
                        rem.isDone
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                      )}
                      title={rem.isDone ? 'Mark as active' : 'Mark as done'}
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal for adding custom reminder */}
      <AddReminderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReminder={handleAdd}
      />
    </div>
  )
}
