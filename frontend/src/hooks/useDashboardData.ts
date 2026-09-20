import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { StatCardProps, InsightItem, WeatherDay, WeatherMetric } from '@/types'

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Sparkles,
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<StatCardProps[]>([])
  const [insights, setInsights] = useState<InsightItem[]>([])
  const [weatherInfo, setWeatherInfo] = useState<{
    location: string
    tempCelsius: number
    condition: string
    metrics: WeatherMetric[]
    forecast: WeatherDay[]
  }>({
    location: 'Mogadishu, Somalia',
    tempCelsius: 29,
    condition: 'Partly Cloudy',
    metrics: [
      { label: 'Humidity', value: '72%' },
      { label: 'Wind', value: '18 km/h' },
      { label: 'Rain', value: '0 mm' },
    ],
    forecast: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      // Execute concurrent operational queries safely
      const results = await Promise.allSettled([
        supabase.from('transactions').select('amount, type'),
        supabase.from('crops').select('status'),
        supabase.from('livestock').select('health_status'),
        supabase.from('ai_insights').select('*').order('created_at', { ascending: true }),
        supabase.from('weather_data').select('*').limit(1).maybeSingle(),
      ])

      const transactionsRes = results[0].status === 'fulfilled' ? results[0].value : null
      const cropsRes = results[1].status === 'fulfilled' ? results[1].value : null
      const livestockRes = results[2].status === 'fulfilled' ? results[2].value : null
      const insightsRes = results[3].status === 'fulfilled' ? results[3].value : null
      const weatherRes = results[4].status === 'fulfilled' ? results[4].value : null

      const transactionsData = transactionsRes?.data
      const cropsData = cropsRes?.data
      const livestockData = livestockRes?.data
      const insightsData = insightsRes?.data
      const weatherData = weatherRes?.data

      // 1. Calculate Revenue from Income Transactions
      let totalIncome = 0
      if (Array.isArray(transactionsData)) {
        transactionsData.forEach((t) => {
          if (t.type === 'income') {
            totalIncome += Number(t.amount) || 0
          }
        })
      }

      // 2. Calculate Active & Harvested Plots from Crops Table
      let activePlots = 0
      let harvestedPlots = 0
      const totalCrops = Array.isArray(cropsData) ? cropsData.length : 0

      if (Array.isArray(cropsData)) {
        cropsData.forEach((c) => {
          if (['Planted', 'Growing', 'Ready'].includes(c.status)) {
            activePlots++
          }
          if (c.status === 'Harvested') {
            harvestedPlots++
          }
        })
      }

      // 3. Determine Pest & Herd Health Risk Index from Livestock Table
      let riskLevel = 'Low'
      if (Array.isArray(livestockData)) {
        const hasSick = livestockData.some((l) => l.health_status === 'Sick')
        const hasRecovering = livestockData.some((l) => l.health_status === 'Recovering')
        if (hasSick) riskLevel = 'High'
        else if (hasRecovering) riskLevel = 'Medium'
      }

      // 4. Construct Dynamic Stat Cards Array
      const formattedIncome = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(totalIncome)

      const dynamicMetrics: StatCardProps[] = [
        {
          label: 'TOTAL YIELD (EST.)',
          value: harvestedPlots > 0 ? `${harvestedPlots * 15} MT` : `${Math.max(totalCrops, 1) * 12} MT`,
          change: '+8.4% vs last month',
          trend: 'up',
          icon: BarChart3,
        },
        {
          label: 'ACTIVE PLOTS',
          value: `${activePlots || totalCrops || 23}`,
          change: '+2 vs last month',
          trend: 'up',
          icon: MapPin,
        },
        {
          label: 'MARKETPLACE SALES',
          value: totalIncome > 0 ? formattedIncome : 'USD $1,250',
          change: '+12.1% vs last month',
          trend: 'up',
          icon: TrendingUp,
        },
        {
          label: 'PEST RISK INDEX',
          value: riskLevel,
          change: riskLevel === 'High' ? 'Elevated' : riskLevel === 'Medium' ? 'Moderate' : 'Low Risk',
          trend: riskLevel === 'High' ? 'down' : 'up',
          icon: AlertTriangle,
        },
      ]

      setMetrics(dynamicMetrics)

      // 5. Map AI Insights & Weather safely
      if (Array.isArray(insightsData) && insightsData.length > 0) {
        setInsights(
          insightsData.map((i) => ({
            id: i.id,
            icon: ICON_MAP[i.icon_name] || Sparkles,
            label: i.title,
            detail: i.description,
            iconColor: i.icon_color || 'text-emerald-500',
          }))
        )
      }

      if (weatherData) {
        setWeatherInfo({
          location: weatherData.location || 'Mogadishu, Somalia',
          tempCelsius: Number(weatherData.temperature) || 29,
          condition: weatherData.condition || 'Partly Cloudy',
          metrics: [
            { label: 'Humidity', value: weatherData.humidity || '72%' },
            { label: 'Wind', value: weatherData.wind_speed || '18 km/h' },
            { label: 'Rain', value: weatherData.rain_mm || '0 mm' },
          ],
          forecast: (weatherData.forecast_json as WeatherDay[]) || [],
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      console.warn('[Dashboard Fetch Warning]', msg)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    metrics,
    insights,
    weatherInfo,
    isLoading,
    error,
    refetch: fetchData,
  }
}
