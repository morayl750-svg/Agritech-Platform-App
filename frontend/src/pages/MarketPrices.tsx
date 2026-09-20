import { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  BarChart3,
  Plus,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBasket,
  Search,
  X,
} from 'lucide-react'
import { useMarketPrices } from '@/hooks/useMarketPrices'
import { cn } from '@/lib/cn'

// ─── Helpers ────────────────────────────────────────────────────────────────────

const COMMODITY_ICONS: Record<string, string> = {
  Sorghum: '🌾',
  Maize:   '🌽',
  Sesame:  '🫘',
  Bananas: '🍌',
  Onions:  '🧅',
  Tomatoes:'🍅',
  Rice:    '🍚',
  Cowpeas: '🫛',
}

const TREND_META = {
  up:     { icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Kordhy' },
  down:   { icon: TrendingDown, color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         label: 'Hoos' },
  stable: { icon: Minus,        color: 'text-gray-600',    bg: 'bg-gray-50 border-gray-200',        label: 'Xaasil' },
}

// ─── Sparkline ──────────────────────────────────────────────────────────────────

function Sparkline({ data, trend }: { data: number[]; trend: 'up' | 'down' | 'stable' }) {
  if (data.length < 2) {
    return <div className="w-full h-10 flex items-center justify-center text-xs text-gray-400">—</div>
  }
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 120, h = 40
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  const color = trend === 'up' ? '#059669' : trend === 'down' ? '#dc2626' : '#6b7280'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

// ─── Commodity Card ──────────────────────────────────────────────────────────────

interface CommodityCardProps {
  summary: ReturnType<typeof useMarketPrices>['summaries'][number]
  selected: boolean
  onClick: () => void
}

function CommodityCard({ summary, selected, onClick }: CommodityCardProps) {
  const meta = TREND_META[summary.trend]
  const TrendIcon = meta.icon
  const emoji = COMMODITY_ICONS[summary.commodity] ?? '🌿'

  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all',
        selected
          ? 'ring-2 ring-emerald-400/40 border-emerald-400 bg-emerald-50/60 shadow-sm'
          : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-xs'
      )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-sm font-bold text-gray-900">{summary.commodity_so}</p>
            <p className="text-xs text-gray-400">{summary.commodity}</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold', meta.bg, meta.color)}>
          <TrendIcon className="w-3 h-3" />
          {summary.change !== 0 ? `${summary.change > 0 ? '+' : ''}${summary.change.toFixed(1)}%` : '—'}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-black text-gray-900">${summary.latestPrice.toFixed(3)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">/ {summary.unit} • Bakaaraha</p>
        </div>
        <Sparkline data={summary.history.map(h => h.price)} trend={summary.trend} />
      </div>
    </button>
  )
}

// ─── Add Price Modal ─────────────────────────────────────────────────────────────

interface AddPriceModalProps {
  onClose: () => void
  onAdd: (commodity: string, commodity_so: string, price: number, unit: string) => Promise<{ success: boolean; error?: string }>
}

function AddPriceModal({ onClose, onAdd }: AddPriceModalProps) {
  const [commodity, setCommodity] = useState('Sorghum')
  const [commodity_so, setCommoditySo] = useState('Masago')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('kg')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const COMMODITY_OPTIONS = [
    { en: 'Sorghum', so: 'Masago' }, { en: 'Maize', so: 'Galley' },
    { en: 'Sesame', so: 'Simsim' }, { en: 'Bananas', so: 'Muus' },
    { en: 'Onions', so: 'Basasha' }, { en: 'Tomatoes', so: 'Tamaandho' },
    { en: 'Rice', so: 'Bariis' },   { en: 'Cowpeas', so: 'Digirta' },
  ]

  const handleCommodityChange = (en: string) => {
    setCommodity(en)
    const opt = COMMODITY_OPTIONS.find(o => o.en === en)
    if (opt) setCommoditySo(opt.so)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseFloat(price)
    if (isNaN(p) || p <= 0) { setFormError('Qiimaha sax ah geli'); return }
    setSubmitting(true)
    const result = await onAdd(commodity, commodity_so, p, unit)
    setSubmitting(false)
    if (result.success) { onClose() }
    else { setFormError(result.error ?? 'Khalad') }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Qiime Cusub Ku Dar</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Alaabta</label>
            <select value={commodity} onChange={e => handleCommodityChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              {COMMODITY_OPTIONS.map(o => <option key={o.en} value={o.en}>{o.so} ({o.en})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qiimaha (USD)</label>
              <input type="number" step="0.001" min="0" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0.000" required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Miisaanka</label>
              <select value={unit} onChange={e => setUnit(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="sack">sack (50kg)</option>
              </select>
            </div>
          </div>
          {formError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{formError}
            </p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? 'Waa la kaydiyaa...' : 'Kaydi Qiimaha'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Price History Chart ─────────────────────────────────────────────────────────

function PriceHistoryChart({ history, commodity }: { history: { date: string; price: number }[]; commodity: string }) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        Taariikhda qiimaha ma jirto weli
      </div>
    )
  }
  const prices = history.map(h => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 0.01
  const w = 560, h = 120
  const pts = history.map((h, i) => {
    const x = (i / (history.length - 1)) * (w - 20) + 10
    const y = h2 => (h2 - min) / range
    return { x, y: h.h - ((h.price - min) / range) * (h - 10) - 5, price: h.price, date: h.date }
  })

  // Simple SVG polyline
  const pathPoints = history.map((h, i) => {
    const x = (i / (history.length - 1)) * (w - 40) + 20
    const y = h2 => 110 - ((h2 - min) / range) * 90
    return `${x},${y(h.price)}`
  }).join(' ')

  const areaPoints = `20,110 ${pathPoints} ${(w - 20)},110`

  return (
    <div className="w-full overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${w} 130`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#priceGrad)" />
        {/* Line */}
        <polyline points={pathPoints} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Latest dot */}
        {history.length > 0 && (() => {
          const last = history[history.length - 1]
          const x = w - 20
          const y = 110 - ((last.price - min) / range) * 90
          return <>
            <circle cx={x} cy={y} r="5" fill="#059669" />
            <circle cx={x} cy={y} r="9" fill="#059669" fillOpacity="0.2" />
          </>
        })()}
        {/* Min/Max labels */}
        <text x="10" y="15" fontSize="9" fill="#6b7280">${max.toFixed(3)}</text>
        <text x="10" y="115" fontSize="9" fill="#6b7280">${min.toFixed(3)}</text>
      </svg>
      <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-2">
        <span>{history[0]?.date?.slice(5)}</span>
        <span>{history[history.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function MarketPrices() {
  const { summaries, loading, error, lastUpdated, refetch, addPrice } = useMarketPrices()
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')

  const selected = summaries.find(s => s.commodity === selectedCommodity)

  const filtered = useMemo(() => {
    if (!search.trim()) return summaries
    const q = search.toLowerCase()
    return summaries.filter(s =>
      s.commodity.toLowerCase().includes(q) || s.commodity_so.toLowerCase().includes(q)
    )
  }, [summaries, search])

  // Summary stats
  const risers  = summaries.filter(s => s.trend === 'up').length
  const fallers = summaries.filter(s => s.trend === 'down').length

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Suuqa Qiimaynta</h1>
            {lastUpdated && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {lastUpdated}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Qiimaynta alaabta Bakaaraha & suuqyada kale</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={refetch} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium shadow-xs transition-all">
            <RefreshCw className={cn('w-3.5 h-3.5 text-emerald-600', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Cusboonaysii</span>
          </button>
          <button type="button" onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors">
            <Plus className="w-3.5 h-3.5" /> Qiime Ku Dar
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-gray-50"><ShoppingBasket className="w-3.5 h-3.5 text-gray-500" /></div>
            <p className="text-xs text-gray-500">Alaabta</p>
          </div>
          <p className="text-2xl font-black text-gray-900">{summaries.length}</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-50"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /></div>
            <p className="text-xs text-emerald-600">Korodhay</p>
          </div>
          <p className="text-2xl font-black text-emerald-700">{risers}</p>
        </div>
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-red-50"><ArrowDownRight className="w-3.5 h-3.5 text-red-500" /></div>
            <p className="text-xs text-red-500">Hoos dhacay</p>
          </div>
          <p className="text-2xl font-black text-red-600">{fallers}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs">{error} — Xog tijaabo ah la isticmaalayaa.</p>
        </div>
      )}

      {/* Main grid: cards + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Commodity cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Raadi alaab..." 
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-50 animate-pulse" />
            ))
          ) : (
            <div className="space-y-3">
              {filtered.map(s => (
                <CommodityCard
                  key={s.commodity}
                  summary={s}
                  selected={selectedCommodity === s.commodity}
                  onClick={() => setSelectedCommodity(prev => prev === s.commodity ? null : s.commodity)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">Alaab la ma helin</div>
              )}
            </div>
          )}
        </div>

        {/* Chart panel */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs h-full">
            {selected ? (
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{COMMODITY_ICONS[selected.commodity] ?? '🌿'}</span>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{selected.commodity_so}</h2>
                      <p className="text-xs text-gray-400">{selected.commodity} — Taariikhda 30 Maalmood</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 text-right">${selected.latestPrice.toFixed(3)}</p>
                    <p className="text-[10px] text-gray-400 text-right">/ {selected.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const meta = TREND_META[selected.trend]
                    const TrendIcon = meta.icon
                    return (
                      <div className={cn('flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold', meta.bg, meta.color)}>
                        <TrendIcon className="w-3 h-3" />
                        {selected.change !== 0 ? `${selected.change > 0 ? '+' : ''}${selected.change.toFixed(2)}%` : 'Xaasil'}
                        <span className="font-normal opacity-70 ml-1">vs shalay</span>
                      </div>
                    )
                  })()}
                  <span className="text-xs text-gray-400">Bakaaraha, Mogadishu</span>
                </div>

                <div className="flex-1 min-h-32">
                  {selected.history.length > 0 ? (
                    <PriceHistoryChart history={selected.history} commodity={selected.commodity} />
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                      Xog taariikh lama helin — xog cusub ku dar si garaafka uu muuqdo
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-3 text-gray-400 p-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Alaab Xulo</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">Alaabta bidixda ka taabo si aad u aragto garaafka taariikhda qiimaynta</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddPriceModal
          onClose={() => setShowAddModal(false)}
          onAdd={addPrice}
        />
      )}
    </div>
  )
}
