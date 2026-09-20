import { useState, useMemo } from 'react'
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wheat,
  Droplets,
  Sprout,
  Filter,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useCropSchedule, type CropSchedule } from '@/hooks/useCropSchedule'
import TaskItem from '@/components/schedule/TaskItem'
import { cn } from '@/lib/cn'

const CROPS = [
  'Mesego (Sorghum)',
  'Galley (Maize)',
  'Simsim (Sesame)',
  'Moos (Bananas)',
  'Yaanyo (Tomatoes)',
  'Basal (Onions)',
  'Digir (Cowpeas)',
  'Qare (Watermelon)',
]

const REGIONS = [
  'Lower Shabelle (Shabeellaha Hoose)',
  'Middle Shabelle (Shabeellaha Dhexe)',
  'Banaadir (Mogadishu)',
  'Bay & Bakool',
  'Hiiraan',
  'Gedo',
  'Jubba',
]

const STATUS_META = {
  active: { label: 'Socota (Active)', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200' },
  upcoming: { label: 'Soo Socda', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200' },
  harvested: { label: 'La Goostay', color: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300 border-gray-200' },
  failed: { label: 'Fashilantay', color: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200' },
}

export default function CropSchedulePage() {
  const { schedules, tasks, loading, createSchedule, toggleTask } = useCropSchedule()
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'done'>('all')

  const [form, setForm] = useState({
    crop_name: CROPS[0],
    plot_name: '',
    region: REGIONS[0],
    planting_date: new Date().toISOString().split('T')[0],
    estimated_harvest_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    watering_interval_days: 3,
    status: 'active' as const,
    notes: '',
  })

  // Ensure default active schedule
  const currentScheduleId = activeScheduleId || (schedules.length > 0 ? schedules[0].id : null)

  const activeSchedule = useMemo(() => {
    return schedules.find((s) => s.id === currentScheduleId) || null
  }, [schedules, currentScheduleId])

  const scheduleTasks = useMemo(() => {
    if (!currentScheduleId) return []
    let filtered = tasks.filter((t) => t.schedule_id === currentScheduleId)
    if (taskFilter === 'pending') filtered = filtered.filter((t) => !t.is_done)
    if (taskFilter === 'done') filtered = filtered.filter((t) => t.is_done)
    return filtered
  }, [tasks, currentScheduleId, taskFilter])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.due_date === todayStr && !t.is_done)
  }, [tasks, todayStr])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.plot_name.trim()) return

    await createSchedule({
      crop_name: form.crop_name,
      plot_name: form.plot_name.trim(),
      region: form.region,
      planting_date: form.planting_date,
      estimated_harvest_date: form.estimated_harvest_date,
      watering_interval_days: Number(form.watering_interval_days) || 3,
      status: form.status,
      notes: form.notes || null,
    })

    setShowForm(false)
    setForm({
      crop_name: CROPS[0],
      plot_name: '',
      region: REGIONS[0],
      planting_date: new Date().toISOString().split('T')[0],
      estimated_harvest_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      watering_interval_days: 3,
      status: 'active',
      notes: '',
    })
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Jadwalka Beerista & Waraabka Tooska ah
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Jadwalka Beerista (Crop Scheduler)
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
            Qorshee xilliga beerista, waraabinta, bacriminta, iyo goosashada dalagyadaada.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold shadow-md shadow-emerald-900/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwal Cusub Ku Dar</span>
        </button>
      </div>

      {/* Today Tasks Alert */}
      {todayTasks.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xs md:text-sm font-bold text-amber-900 dark:text-amber-200">
                Hawlaha Maanta Kaa Sugan ({todayTasks.length})
              </h2>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              Maanta: {new Date().toLocaleDateString('so-SO', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {todayTasks.map((t) => (
              <TaskItem key={t.id} task={t} onToggle={toggleTask} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Schedules List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
              Beeraha & Dalagyada ({schedules.length})
            </h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs">Jadwalka waa la rarayaa...</div>
            ) : schedules.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-gray-400 text-xs">
                Weli jadwal ma jiro. Ku dar jadwal cusub!
              </div>
            ) : (
              schedules.map((sched) => {
                const isSelected = sched.id === currentScheduleId
                const meta = STATUS_META[sched.status] || STATUS_META.active

                return (
                  <button
                    key={sched.id}
                    onClick={() => setActiveScheduleId(sched.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs',
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌱</span>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {sched.crop_name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400">
                            {sched.plot_name}
                          </p>
                        </div>
                      </div>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', meta.color)}>
                        {meta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 text-[11px] text-gray-500 dark:text-neutral-400">
                      <div>
                        <span>Beerista: </span>
                        <strong className="text-gray-800 dark:text-neutral-200">{sched.planting_date}</strong>
                      </div>
                      <div>
                        <span>Goosashada: </span>
                        <strong className="text-gray-800 dark:text-neutral-200">{sched.estimated_harvest_date}</strong>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Tasks for Selected Schedule */}
        <div className="lg:col-span-8 space-y-4">
          {activeSchedule ? (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-5">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{activeSchedule.crop_name}</span>
                    <span className="text-xs font-normal text-gray-500 dark:text-neutral-400">
                      ({activeSchedule.plot_name})
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                    Gobolka: {activeSchedule.region} • Waraabka: {activeSchedule.watering_interval_days} maalmood kasta
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                  {(['all', 'pending', 'done'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTaskFilter(filter)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
                        taskFilter === filter
                          ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-2xs'
                          : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900'
                      )}
                    >
                      {filter === 'all' ? 'Dhammaan' : filter === 'pending' ? 'Dhiman' : 'Dhameystiran'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks list */}
              <div className="space-y-2.5">
                {scheduleTasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    Wax hawl ah kuma jiraan qaybtaan.
                  </div>
                ) : (
                  scheduleTasks.map((t) => <TaskItem key={t.id} task={t} onToggle={toggleTask} />)
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl text-gray-400 text-sm">
              Dooro beerta aad dooneyso inaad aragto hawlaheeda.
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Ku Dar Jadwal Beereed Cusub
            </h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mb-5">
              Hawlaha waraabka iyo goosashada waxaa loo abuurayaa si automatic ah.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Nooca Dalagga
                  </label>
                  <select
                    value={form.crop_name}
                    onChange={(e) => setForm((p) => ({ ...p, crop_name: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Magaca Beerta / Qeybta
                  </label>
                  <input
                    required
                    value={form.plot_name}
                    onChange={(e) => setForm((p) => ({ ...p, plot_name: e.target.value }))}
                    placeholder="e.g. Beerta Koonfur - Qeybta 2"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Taariikhda Beerista
                  </label>
                  <input
                    required
                    type="date"
                    value={form.planting_date}
                    onChange={(e) => setForm((p) => ({ ...p, planting_date: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Taariikhda Goynta La Saadaaliyay
                  </label>
                  <input
                    required
                    type="date"
                    value={form.estimated_harvest_date}
                    onChange={(e) => setForm((p) => ({ ...p, estimated_harvest_date: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Wareegga Waraabka (Maalmo)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.watering_interval_days}
                    onChange={(e) => setForm((p) => ({ ...p, watering_interval_days: Number(e.target.value) || 3 }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                    Gobolka
                  </label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                  Xusuusin Dheeraad ah (Ikhtiyaari)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Talooyin ku saabsan abuurka ama carrada..."
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                >
                  Keydi Jadwalka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
