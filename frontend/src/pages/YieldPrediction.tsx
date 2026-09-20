import { useState } from 'react'
import {
  BrainCircuit,
  Sprout,
  Calendar,
  Layers,
  Droplets,
  MapPin,
  TrendingUp,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  History,
  Info,
  Scale,
} from 'lucide-react'
import { useYieldPrediction, type YieldFormData } from '@/hooks/useYieldPrediction'
import { cn } from '@/lib/cn'

const CROPS = [
  { value: 'Sorghum',  label: 'Sorghum (Mesego / Hadhuudh)', icon: '🌾' },
  { value: 'Maize',    label: 'Maize (Galley)',              icon: '🌽' },
  { value: 'Sesame',   label: 'Sesame (Simsim)',             icon: '🫘' },
  { value: 'Bananas',  label: 'Bananas (Moos)',              icon: '🍌' },
  { value: 'Tomatoes', label: 'Tomatoes (Yaanyo)',           icon: '🍅' },
  { value: 'Onions',   label: 'Onions (Basal)',              icon: '🧅' },
  { value: 'Cowpeas',  label: 'Cowpeas (Digir)',             icon: '🫛' },
]

const SOMALI_REGIONS = [
  'Lower Shabelle (Shabeellaha Hoose)',
  'Middle Shabelle (Shabeellaha Dhexe)',
  'Banaadir (Mogadishu)',
  'Bay & Bakool',
  'Hiiraan',
  'Gedo',
  'Lower Jubba (Jubbada Hoose)',
  'Middle Jubba (Jubbada Dhexe)',
  'Mudug',
  'Galgaduud',
  'Nugaal',
  'Bari',
  'Togdheer',
  'Woqooyi Galbeed',
]

const IRRIGATION_TYPES = [
  { value: 'Rainfed', label: 'Roobka Kaliya (Rainfed)', desc: 'Keligii roobabka xilliga' },
  { value: 'Drip',    label: 'Waraabka Dhibicda (Drip)', desc: 'Biyo badbaadin sare' },
  { value: 'Flood',   label: 'Waraabka Daadka (Flood)', desc: 'Webiga ama kanaalada' },
  { value: 'Canal',   label: 'Kanaalada Beeraha (Canals)', desc: 'Biyaha ceelasha & weelasha' },
]

const SOIL_TYPES = [
  { value: 'Clay Loam', label: 'Dhoobo Carro-saan (Clay Loam)', desc: 'Aad ugu fiican dalagyada badanka' },
  { value: 'Sandy Loam',label: 'Ciid Ciid-saan (Sandy Loam)',  desc: 'Biyo mareen degdeg ah' },
  { value: 'Sandy',     label: 'Ciid Cad (Sandy Soil)',        desc: 'Qallalan, waraab badan u baahan' },
  { value: 'Vertisol',  label: 'Ciid Madow (Black Cotton)',    desc: 'Biyo ceshata, bacrin leh' },
]

export default function YieldPrediction() {
  const { result, history, loading, error, predict } = useYieldPrediction()

  const [form, setForm] = useState<YieldFormData>({
    crop_type: 'Sorghum',
    region: 'Lower Shabelle (Shabeellaha Hoose)',
    area_hectares: 2,
    planting_date: new Date().toISOString().split('T')[0],
    irrigation_type: 'Rainfed',
    soil_type: 'Clay Loam',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await predict(form)
  }

  const setQuickArea = (ha: number) => {
    setForm(prev => ({ ...prev, area_hectares: ha }))
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-neutral-900 to-emerald-950 border border-purple-800/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI-Powered Agronomic Forecast</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Saadaasha Wax Soo Saarka Beeraha
          </h1>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            Geli xogta beertaada (nooca dalagga, dhulka, carada, iyo waraabka). Gemini AI wuxuu xisaabin doonaa inta tan ama kiilo ee aad filan karto xilligan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Left Column: Input Form ────────────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100 dark:border-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Xogta Beertaada</h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Dhameystir xogta si saadaashu u noqoto mid sax ah</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Crop Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                  Nooca Dalagga (Crop Type)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CROPS.map(crop => {
                    const isSelected = form.crop_type === crop.value
                    return (
                      <button
                        type="button"
                        key={crop.value}
                        onClick={() => setForm(p => ({ ...p, crop_type: crop.value }))}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all',
                          isSelected
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-sm ring-1 ring-purple-600'
                            : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 text-gray-700 dark:text-neutral-300'
                        )}
                      >
                        <span className="text-lg">{crop.icon}</span>
                        <span className="truncate">{crop.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Somali Region */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 text-purple-500 mr-1" />
                  Gobolka (Region)
                </label>
                <select
                  value={form.region}
                  onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {SOMALI_REGIONS.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Land Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                    <Scale className="inline w-3.5 h-3.5 text-purple-500 mr-1" />
                    Baaxadda Dhulka (Hectares)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 5, 10, 20].map(h => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => setQuickArea(h)}
                        className={cn(
                          'text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors',
                          form.area_hectares === h
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border-gray-200 dark:border-neutral-700 hover:bg-gray-200'
                        )}
                      >
                        {h} ha
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.area_hectares}
                  onChange={e => setForm(p => ({ ...p, area_hectares: parseFloat(e.target.value) || 1 }))}
                  className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. 2.5"
                  required
                />
              </div>

              {/* Planting Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                  <Calendar className="inline w-3.5 h-3.5 text-purple-500 mr-1" />
                  Taariikhda La Beeray (Planting Date)
                </label>
                <input
                  type="date"
                  value={form.planting_date}
                  onChange={e => setForm(p => ({ ...p, planting_date: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Irrigation and Soil (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                    <Droplets className="inline w-3.5 h-3.5 text-sky-500 mr-1" />
                    Nooca Waraabinta
                  </label>
                  <select
                    value={form.irrigation_type}
                    onChange={e => setForm(p => ({ ...p, irrigation_type: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {IRRIGATION_TYPES.map(i => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                    <Layers className="inline w-3.5 h-3.5 text-amber-500 mr-1" />
                    Nooca Carrada
                  </label>
                  <select
                    value={form.soil_type}
                    onChange={e => setForm(p => ({ ...p, soil_type: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {SOIL_TYPES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI ayaa xisaabinaya saadaasha...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Saadaali Wax Soo Saarka Hadda</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                <History className="w-4 h-4 text-purple-500" />
                Saadaashooyinkii Ugu Dambeeyay
              </div>
              <div className="space-y-2.5">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                        {h.crop.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{h.crop}</p>
                        <p className="text-[11px] text-gray-500 dark:text-neutral-400">{h.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                        {h.yield_est}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right Column: Results ───────────────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Khalad ayaa dhacay</p>
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Main Result Card */}
              <div className="bg-white dark:bg-neutral-900 border border-purple-200 dark:border-purple-800/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Natiijada Saadaasha Guuleysatay
                  </div>
                  <div
                    className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full',
                      result.confidence.toLowerCase().includes('high') || result.confidence.toLowerCase().includes('sare')
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : result.confidence.toLowerCase().includes('medium') || result.confidence.toLowerCase().includes('dhex')
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    )}
                  >
                    Kalsoonida: {result.confidence}
                  </div>
                </div>

                {/* Primary metric */}
                <div className="my-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-emerald-50 to-teal-50 dark:from-purple-950/30 dark:via-neutral-800/60 dark:to-emerald-950/30 border border-purple-100 dark:border-purple-900/30">
                  <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Wadarta Guud Ee La Saadaaliyay
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {result.estimatedYield}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                    Ku salaysan {form.area_hectares} hectare oo {form.crop_type} ah gobolka {form.region}
                  </p>
                </div>

                {/* Factors */}
                {result.factors && result.factors.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                      Waxyaabaha Ugu Muhiimsan Ee Saameeyay (Key Factors)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-800/40 text-purple-800 dark:text-purple-300"
                        >
                          • {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                      Talooyinka Kordhinta Wax Soo Saarka
                    </p>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-800/50 text-xs text-gray-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Analysis Somali */}
                {result.aiAnalysis && (
                  <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                      <BrainCircuit className="w-4 h-4 text-purple-500" />
                      Faallada Khabiirka AI (Af-Soomaali)
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 dark:text-neutral-300 leading-relaxed bg-gray-50 dark:bg-neutral-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-neutral-800 whitespace-pre-wrap">
                      {result.aiAnalysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-neutral-900/50 border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Saadaasha Wax Soo Saarka Halkan Ayay Ka Soo Muuqan Doontaa
              </h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-sm">
                Geli macluumaadka beertaada dhinaca bidix, kadibna taabo badhanka "Saadaali Wax Soo Saarka Hadda" si aad u hesho saadaal degdeg ah oo ku saleysan AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
