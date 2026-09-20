import { useState } from 'react'
import {
  Map,
  Plus,
  Wheat,
  Beef,
  Droplets,
  Archive,
  MapPin,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import { useFarmLocations, type CreateFarmLocationPayload, type FarmLocationType } from '@/hooks/useFarmLocations'
import { cn } from '@/lib/cn'

// ─── Constants ──────────────────────────────────────────────────────────────────

const LOCATION_TYPES: { value: FarmLocationType; label: string; labelSo: string; icon: typeof Map; color: string; bg: string }[] = [
  { value: 'crop_plot',         label: 'Crop Plot',          labelSo: 'Beerta Dalaga',    icon: Wheat,    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { value: 'livestock_station', label: 'Livestock Station',  labelSo: 'Xarunta Xoolaha',  icon: Beef,     color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
  { value: 'water_source',      label: 'Water Source',       labelSo: 'Xarunta Biyaha',   icon: Droplets, color: 'text-sky-600',     bg: 'bg-sky-50 border-sky-200' },
  { value: 'storage',           label: 'Storage',            labelSo: 'Kaydka',            icon: Archive,  color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
]

const SOMALI_REGIONS = [
  'Banaadir (Mogadishu)', 'Lower Shabelle', 'Middle Shabelle', 'Bay & Bakool',
  'Hiiraan', 'Gedo', 'Lower Jubba', 'Middle Jubba', 'Mudug', 'Galgaduud',
  'Nugaal', 'Bari', 'Togdheer', 'Woqooyi Galbeed', 'Sanaag', 'Sool', 'Awdal', 'Sahil',
]

const CROP_TYPES = ['Sorghum', 'Maize', 'Sesame', 'Bananas', 'Tomatoes', 'Onions', 'Cowpeas', 'Rice', 'Sweet Potatoes']

const TYPE_META: Record<FarmLocationType, { label: string; labelSo: string; icon: typeof Map; color: string; bg: string; pinColor: string }> = {
  crop_plot:         { label: 'Crop Plot',         labelSo: 'Beerta',   icon: Wheat,    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', pinColor: '#059669' },
  livestock_station: { label: 'Livestock',         labelSo: 'Xoolo',   icon: Beef,     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     pinColor: '#d97706' },
  water_source:      { label: 'Water Source',      labelSo: 'Biyo',    icon: Droplets, color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200',         pinColor: '#0284c7' },
  storage:           { label: 'Storage',           labelSo: 'Kayd',    icon: Archive,  color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200',   pinColor: '#7c3aed' },
}

// ─── Add Location Form ──────────────────────────────────────────────────────────

interface AddFormProps {
  onSubmit: (p: CreateFarmLocationPayload) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
}

function AddLocationForm({ onSubmit, onClose }: AddFormProps) {
  const [form, setForm] = useState({
    name: '',
    type: 'crop_plot' as FarmLocationType,
    region: SOMALI_REGIONS[1],
    latitude: '2.0',
    longitude: '44.5',
    crop_type: '',
    area_hectares: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Magaca geli'); return }
    const lat = parseFloat(form.latitude)
    const lon = parseFloat(form.longitude)
    if (isNaN(lat) || isNaN(lon)) { setFormError('Latitude/Longitude sax ah geli'); return }

    setSubmitting(true)
    setFormError(null)
    const result = await onSubmit({
      name: form.name,
      type: form.type,
      latitude: lat,
      longitude: lon,
      region: form.region,
      description: form.description || undefined,
      area_hectares: form.area_hectares ? parseFloat(form.area_hectares) : undefined,
      crop_type: form.crop_type || undefined,
    })
    setSubmitting(false)
    if (result.success) { onClose() }
    else { setFormError(result.error ?? 'Khalad') }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Goob Cusub Ku Dar</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Magaca Goobta</label>
          <input
            type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Tusaale: Beerta Koonfur..." required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nooca Goobta</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
            {LOCATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.labelSo}</option>)}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Gobolka</label>
          <select value={form.region} onChange={e => set('region', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
            {SOMALI_REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Lat / Lon */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Latitude</label>
          <input type="number" step="0.0001" value={form.latitude} onChange={e => set('latitude', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Longitude</label>
          <input type="number" step="0.0001" value={form.longitude} onChange={e => set('longitude', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
        </div>

        {/* Crop type (conditional) */}
        {form.type === 'crop_plot' && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nooca Dalaga</label>
            <select value={form.crop_type} onChange={e => set('crop_type', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              <option value="">Xulo...</option>
              {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Area */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Baaxadda (Hectares)</label>
          <input type="number" step="0.1" min="0" value={form.area_hectares} onChange={e => set('area_hectares', e.target.value)} placeholder="0.0"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Sharaxaad (Optional)</label>
          <input type="text" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Macluumaad dheeraad ah..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
        </div>
      </div>

      {formError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{formError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-semibold transition-colors">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {submitting ? 'Waa la kaydiyaa...' : 'Ku Dar Goobta'}
        </button>
        <button type="button" onClick={onClose}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Jooji
        </button>
      </div>
    </form>
  )
}

// ─── Map Visualization (Pure CSS/SVG — no external map lib needed) ──────────────

interface FarmMapVisualizationProps {
  locations: { id: string; name: string; type: FarmLocationType; latitude: number; longitude: number }[]
  selected: string | null
  onSelect: (id: string) => void
}

function FarmMapVisualization({ locations, selected, onSelect }: FarmMapVisualizationProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          <Map className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Goob laguma darin weli</p>
        <p className="text-xs text-center max-w-xs">Ku dar goobahaaga si ay khariidadda ku muuqdaan</p>
      </div>
    )
  }

  // Compute bounds
  const lats = locations.map(l => l.latitude)
  const lons = locations.map(l => l.longitude)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const padLat = Math.max((maxLat - minLat) * 0.25, 0.05)
  const padLon = Math.max((maxLon - minLon) * 0.25, 0.08)

  const toSvg = (lat: number, lon: number) => ({
    x: ((lon - (minLon - padLon)) / (maxLon - minLon + padLon * 2)) * 560,
    y: (1 - (lat - (minLat - padLat)) / (maxLat - minLat + padLat * 2)) * 340,
  })

  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-sky-50/30 rounded-xl overflow-hidden relative">
      {/* Grid lines */}
      <svg width="100%" height="100%" viewBox="0 0 560 340" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d1fae5" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connection lines between points */}
        {locations.length > 1 && locations.map((loc, i) => {
          if (i === 0) return null
          const from = toSvg(locations[i - 1].latitude, locations[i - 1].longitude)
          const to = toSvg(loc.latitude, loc.longitude)
          return (
            <line key={`line-${loc.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="6 4" />
          )
        })}

        {/* Location pins */}
        {locations.map(loc => {
          const { x, y } = toSvg(loc.latitude, loc.longitude)
          const meta = TYPE_META[loc.type]
          const isSelected = selected === loc.id
          return (
            <g key={loc.id} onClick={() => onSelect(loc.id)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring for selected */}
              {isSelected && (
                <circle cx={x} cy={y} r={22} fill={meta.pinColor} fillOpacity="0.15" />
              )}
              {/* Pin shadow */}
              <circle cx={x} cy={y + 1} r={10} fill="rgba(0,0,0,0.15)" />
              {/* Pin body */}
              <circle cx={x} cy={y} r={isSelected ? 12 : 9} fill={meta.pinColor} />
              <circle cx={x} cy={y} r={isSelected ? 7 : 5} fill="white" fillOpacity="0.9" />
              {/* Label */}
              <text x={x} y={y + 26} textAnchor="middle" fontSize="9" fontWeight="600"
                fill="#374151" fontFamily="system-ui, sans-serif">
                {loc.name.length > 14 ? loc.name.slice(0, 14) + '…' : loc.name}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Map info overlay */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg px-2.5 py-1">
        <Info className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] text-gray-500 font-medium">Goobaha Somalia</span>
      </div>
    </div>
  )
}

// ─── Location Card ──────────────────────────────────────────────────────────────

interface LocationCardProps {
  location: ReturnType<typeof useFarmLocations>['locations'][number]
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function LocationCard({ location, isSelected, onSelect, onDelete }: LocationCardProps) {
  const meta = TYPE_META[location.type]
  const Icon = meta.icon

  return (
    <button type="button" onClick={onSelect}
      className={cn(
        'w-full text-left p-3.5 rounded-xl border transition-all',
        isSelected
          ? 'border-emerald-400 bg-emerald-50/70 ring-1 ring-emerald-400/30 shadow-xs'
          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/40'
      )}>
      <div className="flex items-start gap-3">
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border', meta.bg, meta.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{location.name}</p>
            <button type="button" onClick={e => { e.stopPropagation(); onDelete() }}
              className="p-0.5 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className={cn('text-[10px] font-semibold uppercase tracking-wide mt-0.5', meta.color)}>
            {meta.labelSo}
          </p>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {location.region && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500">
                <MapPin className="w-2.5 h-2.5" />{location.region}
              </span>
            )}
            {location.area_hectares && (
              <span className="text-[10px] text-gray-500">{location.area_hectares} ha</span>
            )}
            {location.crop_type && (
              <span className="text-[10px] text-emerald-600 font-medium">{location.crop_type}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FarmMap() {
  const { locations, loading, error, addLocation, removeLocation } = useFarmLocations()
  const [showForm, setShowForm] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [legendOpen, setLegendOpen] = useState(false)

  const selectedLocation = locations.find(l => l.id === selectedId) ?? null
  const typeCount = LOCATION_TYPES.map(t => ({
    ...t,
    count: locations.filter(l => l.type === t.value).length,
  }))

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Farm Map</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {locations.length} goob
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Khariidadda beerahaaga, xoolaha iyo kaydadka</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Goob Ku Dar
        </button>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2">
        {typeCount.map(t => {
          const Icon = t.icon
          return (
            <div key={t.value} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold', t.bg, t.color)}>
              <Icon className="w-3.5 h-3.5" />
              {t.count} {t.labelSo}
            </div>
          )
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <AddLocationForm onSubmit={addLocation} onClose={() => setShowForm(false)} />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs">{error} — Xog-naqshad la'aanta darteed sample data la isticmaalayaa.</p>
        </div>
      )}

      {/* Main content — map + list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Map className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Khariidadda Goobaha</h2>
            </div>
            <button type="button" onClick={() => setLegendOpen(v => !v)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
              Calaamadaha {legendOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Legend */}
          {legendOpen && (
            <div className="px-5 py-2 flex flex-wrap gap-3 border-b border-gray-100 bg-gray-50/50">
              {LOCATION_TYPES.map(t => {
                const Icon = t.icon
                return (
                  <div key={t.value} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_META[t.value].pinColor }} />
                    <Icon className="w-3 h-3" />
                    {t.labelSo}
                  </div>
                )
              })}
            </div>
          )}

          <div className="p-4 h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Waa la rarayo...</span>
              </div>
            ) : (
              <FarmMapVisualization
                locations={locations}
                selected={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Selected location detail */}
          {selectedLocation && (
            <div className="px-5 py-3 border-t border-gray-100 bg-emerald-50/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <p className="text-sm font-semibold text-gray-900">{selectedLocation.name}</p>
                <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border', TYPE_META[selectedLocation.type].bg, TYPE_META[selectedLocation.type].color)}>
                  {TYPE_META[selectedLocation.type].labelSo}
                </span>
              </div>
              {selectedLocation.description && (
                <p className="text-xs text-gray-500 mt-1 ml-5">{selectedLocation.description}</p>
              )}
              <div className="flex gap-4 mt-1.5 ml-5 text-xs text-gray-400">
                <span>{selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}</span>
                {selectedLocation.area_hectares && <span>{selectedLocation.area_hectares} ha</span>}
              </div>
            </div>
          )}
        </div>

        {/* Location list */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Liiska Goobaha</h2>
            <p className="text-xs text-gray-500 mt-0.5">Taabo goob si aad u dooratid</p>
          </div>
          <div className="p-3 space-y-2 max-h-[480px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-50 animate-pulse" />
              ))
            ) : locations.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Wax goob ah kuma jirin — ku dar koowaad!
              </div>
            ) : (
              locations.map(loc => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  isSelected={selectedId === loc.id}
                  onSelect={() => setSelectedId(prev => prev === loc.id ? null : loc.id)}
                  onDelete={() => removeLocation(loc.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
