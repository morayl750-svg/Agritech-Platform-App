import { useState } from 'react'
import {
  Bell,
  Droplets,
  Sprout,
  AlertTriangle,
  Syringe,
  FlaskConical,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import type { FarmerReminder, ReminderCategory } from '@/types/reminders'
import {
  getReminders,
  addReminder,
  toggleReminderDone,
} from '@/services/reminderService'
import { AddReminderModal } from './AddReminderModal'
import { cn } from '@/lib/cn'

export function RemindersWidget() {
  const [reminders, setReminders] = useState<FarmerReminder[]>(() => getReminders())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const activeReminders = reminders.filter((r) => !r.isDone)

  const handleToggleDone = (id: string) => {
    const updated = toggleReminderDone(id)
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
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Nidaamka Xusuusinta (Farmer Reminders)
              </h2>
              <p className="text-xs text-gray-500">Waraabka, Goosashada & Digniinaha Cimilada</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus size={13} />
            <span>Kee Dar</span>
          </button>
        </div>

        {/* Reminders list */}
        <div className="space-y-2.5">
          {activeReminders.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 rounded-xl">
              Ma jiraan xusuusino firfircoon.
            </div>
          ) : (
            activeReminders.slice(0, 4).map((rem) => (
              <div
                key={rem.id}
                className={cn(
                  'p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3',
                  rem.urgency === 'emergency'
                    ? 'bg-red-50/70 border-red-200/90'
                    : 'bg-gray-50/60 border-gray-200/80 hover:bg-gray-50'
                )}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {getCategoryIcon(rem.category, 'w-4 h-4')}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{rem.title}</h4>
                      {rem.urgency === 'emergency' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700 border border-red-200">
                          Degdeg
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                      {rem.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-0.5 font-medium">
                      <span>📍 {rem.target}</span>
                      <span>•</span>
                      <span>⏰ {rem.dueDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDone(rem.id)}
                  className="p-1 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer flex-shrink-0"
                  title="Mark as completed"
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <AddReminderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReminder={handleAdd}
      />
    </div>
  )
}
