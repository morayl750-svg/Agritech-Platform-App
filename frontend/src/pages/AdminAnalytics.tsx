import { useState } from 'react'
import {
  BarChart3,
  DollarSign,
  Lock,
  Package,
  ShoppingCart,
  Users,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdminStatCard from '@/components/admin/AdminStatCard'
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const ADMIN_PASSWORD = 'agrismart-admin-2026'
const CHART_COLORS = ['#059669', '#0284c7', '#d97706', '#7c3aed', '#dc2626', '#0d9488']

import { Link } from 'react-router-dom'

export default function AdminAnalytics() {
  const { user } = useAuth()
  const isAdminUser = user?.role === 'Admin'

  const { stats, loading, reload } = useAdminAnalytics()

  // Strict Access Control: If user is not Mohamed Rayl (Admin), lock this page completely
  if (!isAdminUser) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-6 bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 mb-2">
              Lama Oggola (Access Denied)
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Qeybta Maamulka Waa Lagaa Xiray
            </h2>
            <p className="text-xs text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Xogta maamulka sare ee AgriSmart waxaa loo oggol yahay oo kaliya <strong>Mohamed Rayl (Admin)</strong>.
              Koontadaada (<strong>{user?.full_name || 'Macmiil'}</strong>) waxay leedahay heerka <strong>Macmiil (User)</strong>, mana haysato rukhsad aad ku eegto xogta dakhliga guud ama xogaha qarsoon ee maamulka.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Ku Noqo Bogga Hoyga (Dashboard)
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Maamulka Guud Ee AgriSmart
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Xogta & Falanqaynta Maamulka (Admin Analytics)
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
            Dakhliga suuqa, dalabaadka mobaylka (EVC/Zaad), iyo alaabta loogu jecelyahay platform-ka.
          </p>
        </div>

        <button
          onClick={reload}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-gray-700 dark:text-neutral-300 hover:bg-gray-50 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
          <span>Cusboonaysii</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Dakhliga Guud (Revenue)"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            subtitle="Lacagta EVC / Zaad lagu bixiyay"
            icon={DollarSign}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          />
          <AdminStatCard
            title="Wadarta Dalabaadka (Orders)"
            value={stats.totalOrders}
            subtitle="Iibsiyada ka dhacay suuqa"
            icon={ShoppingCart}
            color="bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
          />
          <AdminStatCard
            title="Alaabta Suuqa Taal"
            value={stats.totalProducts}
            subtitle="Dalagyo iyo agab beereed"
            icon={Package}
            color="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          />
          <AdminStatCard
            title="Qoraallada Bulshada"
            value={stats.totalPosts}
            subtitle="Wadahadallada beeraleyda"
            icon={Users}
            color="bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
          />
        </div>
      )}

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Revenue BarChart */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Dakhliga Maalinlaha ah (Daily Revenue)
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Dakhliga soo xarooday toddobaadkii u dambeeyay (USD)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                +18.4% Toddobaadkan
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderColor: '#383838',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Dakhliga']}
                  />
                  <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Alaabta Ugu Iibka Badan (Top Products)
            </h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mb-5">
              Dalagyada beeraleyda ugu badan ee la dalbaday
            </p>

            <div className="space-y-4">
              {stats.topProducts.map((p, i) => {
                const maxOrders = stats.topProducts[0]?.order_count || 1
                const percent = Math.min(100, Math.round((p.order_count / maxOrders) * 100))
                const barColor = CHART_COLORS[i % CHART_COLORS.length]

                return (
                  <div key={p.product_name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[200px]">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: barColor }}
                        >
                          {i + 1}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-neutral-200 truncate">
                          {p.product_name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-900 dark:text-white">
                          ${p.total_revenue.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">
                          ({p.order_count} dalab)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
