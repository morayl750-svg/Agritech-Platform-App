import { useNavigate } from 'react-router-dom'
import {
  BrainCircuit,
  ShoppingBasket,
  Sprout,
  BookOpen,
  Users,
  CloudSun,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Carrot,
  Bug,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { AIInsightsList } from '@/components/dashboard/AIInsightsList'
import { WeatherWidget } from '@/components/dashboard/WeatherWidget'
import { RemindersWidget } from '@/components/reminders/RemindersWidget'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDashboardData } from '@/hooks/useDashboardData'
import { formatSomaliDate, getCurrentSomaliSeason } from '@/services/weatherService'

export default function Dashboard() {
  const navigate = useNavigate()
  const { metrics, insights, weatherInfo, isLoading } = useDashboardData()
  const season = getCurrentSomaliSeason()

  const quickModules = [
    {
      title: 'Dalabka Khudaarta',
      titleSomali: 'Khudaarta Cusub',
      desc: 'Dalbo tamaandho, basal, baradho, moos iyo miro toos beeraha looga keenay',
      icon: Carrot,
      href: '/khudaar',
      badge: '100% Dabiici',
      color: 'from-emerald-600 to-green-700',
    },
    {
      title: 'Sunta Cayayaanka',
      titleSomali: 'Suuqa Sunta & Daawooyinka',
      desc: 'Sunta diirka galayda, ayaxa, boqoshaada, haramaanka & qalabka buufinta',
      icon: Bug,
      href: '/marketplace',
      badge: 'Agro Chem',
      color: 'from-amber-600 to-orange-700',
    },
    {
      title: 'AI Agronomist',
      titleSomali: 'AI Aqoonse',
      desc: 'Talooyinka abuurka, cudurada dhirta & caafimaadka carrada 24/7',
      icon: BrainCircuit,
      href: '/ai-agronomist',
      badge: 'Gems AI',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Livestock & Crops',
      titleSomali: 'Dalagyada & Xoolaha',
      desc: "Maamul lo'o, geel, ido iyo beeraha firfircoon ee 23 plot",
      icon: Sprout,
      href: '/livestock-crops',
      badge: '23 Plots',
      color: 'from-green-600 to-emerald-700',
    },
    {
      title: 'Weather Live',
      titleSomali: 'Cimilada Tooska ah',
      desc: 'Saadaasha cimilada tooska ah ee 18-ka Gobol ee Soomaaliya',
      icon: CloudSun,
      href: '/weather',
      badge: 'Live Satellite',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      title: 'Financial Ledger',
      titleSomali: 'Diiwaanka Maaliyadda',
      desc: "Xisaabi kharashka abuurka, faa'iidada & dakhliga bilaha",
      icon: BookOpen,
      href: '/financial-ledger',
      badge: 'Ledger Pro',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'Community',
      titleSomali: 'Bulshada Beeralayda',
      desc: 'Wadaag khibradaha beeralayda & xoolo dhaatada Soomaaliyeed',
      icon: Users,
      href: '/community',
      badge: 'Active Forum',
      color: 'from-purple-600 to-violet-700',
    },
  ]

  const marketPrices = [
    { name: 'Sisinta (Sesame)', location: 'Muqdisho', price: '$125 / Qintaar', change: '+5.2%', isUp: true },
    { name: 'Galleyda (Maize)', location: 'Baydhabo', price: '$42 / Qintaar', change: '+2.1%', isUp: true },
    { name: 'Haruurka (Sorghum)', location: 'Beledweyne', price: '$38 / Qintaar', change: '-1.0%', isUp: false },
    { name: 'Caano Geel (Camel Milk)', location: 'Garowe', price: '$2.5 / Liter', change: '+3.5%', isUp: true },
    { name: 'Qawanka (Watermelon)', location: 'Jowhar', price: '$14 / Boos', change: '+8.0%', isUp: true },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Welcome Section (Hoyga Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-850 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AgriSmart Somalia Platform</span>
              <span className="opacity-40">|</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatSomaliDate()}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kusoo Dhawoow Hoyga AgriSmart 👋
            </h1>

            <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
              Muuqaalka guud ee beertaada, cimilada tooska ah ee 18-ka gobol, qiimaha suuqyada iyo talooyinka caqliga badan ee AI.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/ai-agronomist')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Waydii Agri AI</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/weather')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <CloudSun className="w-4 h-4 text-teal-300" />
                <span>Cimilada Tooska ah</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/khudaar')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs"
              >
                <Carrot className="w-4 h-4 text-emerald-300" />
                <span>Dalbo Khudaar</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <Bug className="w-4 h-4 text-amber-300" />
                <span>Sunta Cayayaanka</span>
              </button>
            </div>
          </div>

          {/* Right Season & Quick Weather Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                XILLIGA HADDA
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                {season.name}
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-white">{season.somaliName}</p>
              <p className="text-[11px] text-emerald-100/80 mt-1 line-clamp-2">
                {season.advice}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-medium">Biyo dhac: Normal</span>
              <span className="text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Waa Diyaar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          : metrics.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* 3. Core Modules Quick Access Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Barnaamijyada AgriSmart (Platform Modules)
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">Dooradaha Muhiimka ah</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickModules.map((mod) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.href}
                onClick={() => navigate(mod.href)}
                className="group relative bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold border border-gray-200">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {mod.titleSomali}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Fura Barnaamijka</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Farmer Reminders & Live Weather Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reminders & Emergency Alerts Widget */}
        <RemindersWidget />

        {/* Live Weather Widget Preview */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <WeatherWidget
            location={weatherInfo.location}
            tempCelsius={weatherInfo.tempCelsius}
            condition={weatherInfo.condition}
            metrics={weatherInfo.metrics}
            forecast={weatherInfo.forecast}
          />
        )}
      </div>

      {/* 5. Live AI Insights Section */}
      <div>
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <AIInsightsList items={insights} updatedLabel="Live from AI Engine" />
        )}
      </div>

      {/* 5. Marketplace Commodity Prices Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Qiimaha Midhaha & Dalagyada ee Suuqyada (Market Commodity Index)
              </h2>
              <p className="text-xs text-gray-500">Qiimaha tooska ah ee suuqyada ugu waaweyn Soomaaliya</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/khudaar')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Dalbo Khudaarta Beeraha <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Midhaha / Dalagga</th>
                <th className="py-2.5 px-3">Suuqa / Gobolka</th>
                <th className="py-2.5 px-3">Qiimaha Hadda</th>
                <th className="py-2.5 px-3 text-right">Is-badalka 24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {marketPrices.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900">{item.name}</td>
                  <td className="py-3 px-3 text-gray-500 font-medium">{item.location}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{item.price}</td>
                  <td className="py-3 px-3 text-right font-bold">
                    <span className={item.isUp ? 'text-emerald-600' : 'text-red-500'}>
                      {item.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
