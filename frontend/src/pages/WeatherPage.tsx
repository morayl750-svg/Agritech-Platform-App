import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  RefreshCw,
  Search,
  MapPin,
  Sparkles,
  Calendar,
  Thermometer,
  Compass,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react'
import {
  SOMALI_REGIONS,
  type SomaliRegion,
  type LiveWeatherData,
  fetchLiveWeather,
  getFallbackWeatherData,
  formatSomaliDate,
  getCurrentSomaliSeason,
} from '@/services/weatherService'
import { cn } from '@/lib/cn'

export default function WeatherPage() {
  const [selectedRegion, setSelectedRegion] = useState<SomaliRegion>(SOMALI_REGIONS[0]) // Default Banaadir
  const [weatherData, setWeatherData] = useState<LiveWeatherData>(() =>
    getFallbackWeatherData(SOMALI_REGIONS[0])
  )
  const [regionSearch, setRegionSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string>('')

  // Load weather for selected region
  const loadWeather = useCallback(async (region: SomaliRegion) => {
    setIsLoading(true)
    try {
      const data = await fetchLiveWeather(region)
      setWeatherData(data)
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } catch (err) {
      console.error('Error fetching live weather:', err)
      setWeatherData(getFallbackWeatherData(region))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWeather(selectedRegion)
  }, [selectedRegion, loadWeather])

  // Filtered Somali regions based on search term
  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return SOMALI_REGIONS
    const q = regionSearch.toLowerCase()
    return SOMALI_REGIONS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q)
    )
  }, [regionSearch])

  // Get current season info
  const seasonInfo = getCurrentSomaliSeason()

  // Helper to render weather icon
  const renderWeatherIcon = (code: number | string, className = 'w-10 h-10') => {
    if (typeof code === 'string') {
      const c = code.toLowerCase()
      if (c.includes('rain') || c.includes('roob')) return <CloudRain className={cn('text-sky-300', className)} />
      if (c.includes('thunder') || c.includes('gurgur')) return <CloudLightning className={cn('text-amber-300', className)} />
      if (c.includes('sunny') || c.includes('hot') || c.includes('cadaan')) return <Sun className={cn('text-amber-300', className)} />
      if (c.includes('fog') || c.includes('buuq')) return <CloudFog className={cn('text-slate-300', className)} />
      return <CloudSun className={cn('text-teal-200', className)} />
    }

    if (code === 0) return <Sun className={cn('text-amber-300', className)} />
    if (code >= 1 && code <= 3) return <CloudSun className={cn('text-teal-200', className)} />
    if (code >= 51 && code <= 82) return <CloudRain className={cn('text-sky-300', className)} />
    if (code >= 95) return <CloudLightning className={cn('text-amber-300', className)} />
    if (code === 45 || code === 48) return <CloudFog className={cn('text-slate-300', className)} />
    return <CloudSun className={cn('text-teal-200', className)} />
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Weather</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              TOOS (LIVE)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Saadaasha cimilada tooska ah iyo xaaladda beeraha ee 18-ka Gobol ee Soomaaliya
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Region Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = SOMALI_REGIONS.find((r) => r.id === e.target.value)
                if (reg) setSelectedRegion(reg)
              }}
              className="appearance-none bg-white border border-gray-200 hover:border-emerald-500 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-gray-700 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              {SOMALI_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  📍 {r.name} ({r.capital})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadWeather(selectedRegion)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Update Live Weather"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-emerald-600', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">Cusboonaysii</span>
          </button>
        </div>
      </div>

      {/* Main Gradient Weather Banner Card (Matching Screenshot Design) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 md:p-8 text-white shadow-xl">
        {/* Subtle background glow circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Location, Today's Label & Main Temperature */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-200" />
              <span>{formatSomaliDate()}</span>
              <span className="opacity-40">|</span>
              <MapPin className="w-3.5 h-3.5 text-emerald-200" />
              <span>{selectedRegion.name} ({selectedRegion.capital})</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-md">
                {weatherData.temperature}°
                <span className="text-3xl font-medium text-emerald-200 ml-1">C</span>
              </span>

              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                  Maanta
                </h2>
                <p className="text-sm font-semibold tracking-wider text-teal-100 uppercase mt-0.5">
                  {weatherData.conditionText} ({weatherData.conditionSomali})
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Weather Icon with Glow */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/15 p-4 md:p-5 rounded-2xl">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner flex items-center justify-center">
              {renderWeatherIcon(weatherData.conditionCode, 'w-16 h-16 md:w-20 md:h-20 drop-shadow-lg')}
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase font-bold tracking-widest text-teal-100">
                {weatherData.conditionText}
              </div>
              <div className="text-xs font-semibold text-white/90">
                QOYAANKA: <span className="text-white font-bold">{weatherData.humidity}%</span>
              </div>
              <div className="text-xs font-semibold text-white/90">
                DABAYSHA: <span className="text-white font-bold">{weatherData.windSpeed} KM/H</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="block text-[10px] font-bold tracking-wider text-teal-100 uppercase">QOYAANKA (HUMIDITY)</span>
            <span className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-teal-200" />
              {weatherData.humidity}%
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="block text-[10px] font-bold tracking-wider text-teal-100 uppercase">DABAYSHA (WIND)</span>
            <span className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-200" />
              {weatherData.windSpeed} KM/H
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="block text-[10px] font-bold tracking-wider text-teal-100 uppercase">SHU'ACASHA UV</span>
            <span className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-200" />
              {weatherData.uvIndex} / 11
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="block text-[10px] font-bold tracking-wider text-teal-100 uppercase">ROOBKA (PRECIP)</span>
            <span className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-200" />
              {weatherData.precipitationChance}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Saadaasha Toddobaadka (7-Day Forecast) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Saadaasha Toddobaadka ({selectedRegion.name})
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">7 Maalmood</span>
        </div>

        {/* Grid of 7 forecast cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weatherData.forecastDays.map((day, idx) => (
            <div
              key={day.date + idx}
              className={cn(
                'flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all hover:shadow-sm text-center',
                idx === 0
                  ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-400/30'
                  : 'bg-white border-gray-100 hover:border-emerald-200'
              )}
            >
              {/* Day Header */}
              <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                {day.dayAbbr}
              </span>

              {/* Weather Icon */}
              <div className="my-2 p-2 rounded-xl bg-gray-50 flex items-center justify-center">
                {renderWeatherIcon(day.conditionCode, 'w-8 h-8')}
              </div>

              {/* Temperature */}
              <div className="space-y-0.5">
                <span className="text-lg font-bold text-gray-900 block">
                  {day.maxTemp}°
                </span>
                <span className="text-[10px] font-semibold text-gray-400 block">
                  {day.minTemp}°
                </span>
              </div>

              {/* Condition Badge */}
              <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 truncate max-w-full">
                {day.conditionText}
              </span>

              {/* Rain Chance Bar */}
              <div className="mt-2.5 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(day.precipitationChance, 10)}%` }}
                  title={`Roobka: ${day.precipitationChance}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Cimilada Gobollada Soomaaliya (18 Regions Grid) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                Cimilada Gobollada Soomaaliya
              </h2>
              <p className="text-xs text-gray-500">Taabo gobol si aad u eegto cimilada tooska ah</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
              18 GOBOL
            </span>

            {/* Region Search Input */}
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Raadi gobol..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Somali Regions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRegions.map((reg) => {
            const isSelected = selectedRegion.id === reg.id
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer group',
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-gray-100 hover:border-emerald-300 hover:bg-gray-50/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    )}
                  >
                    {renderWeatherIcon(reg.condition || 'Sunny', 'w-5 h-5')}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {reg.name}
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Caasimada: <span className="text-gray-700 font-semibold">{reg.capital}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-gray-900">
                    {isSelected ? weatherData.temperature : reg.temp}°C
                  </div>
                  <div className="text-[10px] font-semibold uppercase text-emerald-800 tracking-wider">
                    {isSelected ? weatherData.conditionSomali : reg.conditionSomali}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 4: Agricultural Weather Advice & Seasonal Guidance (Talada Maanta) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Seasonal Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold tracking-widest text-emerald-300 uppercase">
                TALADA MAANTA (DAILY TIP)
              </h3>
            </div>

            <h4 className="text-base font-bold text-white leading-snug">
              {seasonInfo.somaliName}
            </h4>
            <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
              {seasonInfo.advice}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-emerald-300 font-medium">
              Xilliga Hadda: <strong className="text-white">{seasonInfo.name}</strong>
            </span>
            <a
              href="/ai-agronomist"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Waydii Agri AI <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Agricultural Weather Risk Indicator */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                XAALADDA WARAABKA & DHIRTA
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Biyo Dhac (Evaporation):</span>
                <span className="text-xs font-bold text-amber-600">Dhexdhexaad (Medium)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Khatarta Cayayaanka:</span>
                <span className="text-xs font-bold text-emerald-600">Yar (Low Risk)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Xawaaraha Dabaysha:</span>
                <span className="text-xs font-bold text-gray-900">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-3">
            Saadaasha waxaa toos looga soo qaadayaa xogta satalaytka ee Open-Meteo.
          </p>
        </div>

        {/* Quick Weather Insights for Farmers */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <Thermometer className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                XAALADDA CEELASHA & ROOBKA
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Xaddiga roobka la filayo ee 24-ka saac ee soo socda gobolka{' '}
              <strong>{selectedRegion.name}</strong> waa <strong>{weatherData.precipitationChance}%</strong>.
              Haddi aad waraabinayso beeraha, isticmaal hababka casriga ah si biyaha loo dhiyo.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Peeqaanka: {lastRefreshed || 'Hadda'}</span>
            <span className="font-semibold text-emerald-700">Somalia Ag-Weather</span>
          </div>
        </div>
      </div>
    </div>
  )
}
