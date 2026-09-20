import { useState } from 'react'
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Phone,
  MapPin,
  AlertTriangle,
  Loader2,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useWeatherAlerts, type CreateWeatherAlertPayload } from '@/hooks/useWeatherAlerts'

// ─── Constants ────────────────────────────────────────────────────────────────

const SOMALI_REGIONS = [
  'Banaadir (Mogadishu)',
  'Lower Shabelle',
  'Middle Shabelle',
  'Bay & Bakool',
  'Hiiraan',
  'Gedo',
  'Lower Jubba',
  'Middle Jubba',
  'Togdheer',
  'Woqooyi Galbeed (Hargeysa)',
  'Mudug',
  'Galgaduud',
  'Nugaal',
  'Bari',
  'Sanaag',
  'Sool',
  'Awdal',
  'Sahil',
]

const ALERT_TYPE_OPTIONS = [
  { value: 'rain',    label: 'Roob Badan',    icon: CloudRain,       color: 'text-sky-500',    bg: 'bg-sky-50 border-sky-200' },
  { value: 'drought', label: 'Abaar',          icon: Droplets,        color: 'text-amber-500',  bg: 'bg-amber-50 border-amber-200' },
  { value: 'storm',   label: 'Duufaan',        icon: CloudLightning,  color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { value: 'flood',   label: 'Daadadka',       icon: CloudRain,       color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-200' },
  { value: 'wind',    label: 'Dabaylo Xoog',   icon: Wind,            color: 'text-teal-500',   bg: 'bg-teal-50 border-teal-200' },
]

const ALERT_TYPE_META: Record<string, { label: string; color: string }> = {
  rain:    { label: 'Roob',    color: 'text-sky-600 bg-sky-50 border-sky-200' },
  drought: { label: 'Abaar',   color: 'text-amber-600 bg-amber-50 border-amber-200' },
  storm:   { label: 'Duufaan', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  flood:   { label: 'Daad',    color: 'text-blue-600 bg-blue-50 border-blue-200' },
  wind:    { label: 'Dabaylo', color: 'text-teal-600 bg-teal-50 border-teal-200' },
}

// ─── Create Alert Form ─────────────────────────────────────────────────────────

interface CreateFormProps {
  onCancel: () => void
  onCreated: () => void
  createAlert: (p: CreateWeatherAlertPayload) => Promise<{ success: boolean; error?: string }>
}

function CreateAlertForm({ onCancel, onCreated, createAlert }: CreateFormProps) {
  const [region, setRegion] = useState(SOMALI_REGIONS[0])
  const [phone, setPhone] = useState('')
  const [threshold, setThreshold] = useState('20')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['rain'])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const toggleType = (val: string) =>
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTypes.length === 0) {
      setFormError('Ugu yaraan hal nooc dooro')
      return
    }
    setSubmitting(true)
    setFormError(null)
    const result = await createAlert({
      region,
      phone_number: phone,
      alert_types: selectedTypes,
      threshold_mm: Number(threshold),
    })
    setSubmitting(false)
    if (result.success) {
      onCreated()
    } else {
      setFormError(result.error ?? 'Khalad ayaa dhacay')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Ogeysiis Cusub</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Region */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          <MapPin className="w-3 h-3 inline mr-1" />
          Gobolka
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        >
          {SOMALI_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          <Phone className="w-3 h-3 inline mr-1" />
          Lambarka Telefoonka (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+252 61 xxx xxxx"
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Alert Types */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Noocyada Ogeysiiska
        </label>
        <div className="flex flex-wrap gap-2">
          {ALERT_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const active = selectedTypes.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleType(opt.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                  active
                    ? opt.bg + ' ' + opt.color + ' border-current shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rain threshold */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Xadka Roobka (mm) — Ogeysiis markaas la dhaafaa
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="flex-1 accent-emerald-600"
          />
          <span className="text-sm font-bold text-gray-900 w-14 text-right">
            {threshold} mm
          </span>
        </div>
      </div>

      {formError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {formError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {submitting ? 'Waa la kaydiyaa...' : 'Kaydi Ogeysiiska'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Jooji
        </button>
      </div>
    </form>
  )
}

// ─── Alert Card ────────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: {
    id: string
    region: string
    phone_number: string | null
    alert_types: string[]
    threshold_mm: number
    is_active: boolean
    last_alerted_at: string | null
  }
  onToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
}

function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  return (
    <div
      className={cn(
        'bg-white border rounded-xl p-4 flex items-start gap-3 transition-all',
        alert.is_active ? 'border-gray-200 shadow-xs' : 'border-gray-100 opacity-60'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
          alert.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
        )}
      >
        {alert.is_active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-gray-900 truncate">{alert.region}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Toggle */}
            <button
              type="button"
              onClick={() => onToggle(alert.id, !alert.is_active)}
              title={alert.is_active ? 'Dembi' : 'Shid'}
              className="text-gray-400 hover:text-emerald-600 transition-colors"
            >
              {alert.is_active ? (
                <ToggleRight className="w-6 h-6 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(alert.id)}
              title="Tirtir"
              className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alert type pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {alert.alert_types.map((type) => {
            const meta = ALERT_TYPE_META[type]
            return (
              <span
                key={type}
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide',
                  meta?.color ?? 'text-gray-600 bg-gray-50 border-gray-200'
                )}
              >
                {meta?.label ?? type}
              </span>
            )
          })}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <CloudRain className="w-3 h-3" />
            Xad: <strong className="text-gray-600">{alert.threshold_mm}mm</strong>
          </span>
          {alert.phone_number && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{alert.phone_number}</span>
            </span>
          )}
          {alert.last_alerted_at && (
            <span>
              Ogeysiis dambe:{' '}
              <strong className="text-gray-600">
                {new Date(alert.last_alerted_at).toLocaleDateString('so-SO', {
                  month: 'short',
                  day: 'numeric',
                })}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function WeatherAlertsSection() {
  const { alerts, loading, error, createAlert, toggleAlert, deleteAlert } = useWeatherAlerts()
  const [showForm, setShowForm] = useState(false)

  const activeCount = alerts.filter((a) => a.is_active).length

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Ogeysiisyada Cimilada
            </h2>
            <p className="text-xs text-gray-500">
              SMS iyo ogeysiis toos ah marka cimiladu is beddesto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active count badge */}
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeCount} firfircoon
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              showForm
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            )}
          >
            {showForm ? (
              <>
                <X className="w-3.5 h-3.5" /> Xir
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Kudar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <CreateAlertForm
          createAlert={createAlert}
          onCancel={() => setShowForm(false)}
          onCreated={() => setShowForm(false)}
        />
      )}

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Ogeysiisyada waa la rarayo...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {!loading && !error && alerts.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BellOff className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-500">Ogeysiis laguma darin</p>
          <p className="text-xs text-gray-400 text-center max-w-xs">
            &ldquo;Kudar&rdquo; badhanka guji si aad u abuurto ogeysiiskaaga koowaad
          </p>
        </div>
      )}

      {/* Alert Cards */}
      {!loading && alerts.length > 0 && (
        <div className="space-y-3">
          {/* Separator if form is open */}
          {showForm && <div className="border-t border-gray-100" />}

          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={toggleAlert}
              onDelete={deleteAlert}
            />
          ))}
        </div>
      )}

      {/* Info footer */}
      <div className="pt-1 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-400">
        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
        <span>
          SMS ogeysiisyada waxay u baahan yihiin Twilio API. Dashboard-ka ogeysiisyadu waxay si toos ah u shaqeynayaan.
        </span>
      </div>
    </div>
  )
}
