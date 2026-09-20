import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface PriceRecord {
  id: string
  commodity: string
  commodity_so: string
  price_usd: number
  unit: string
  market: string
  region: string
  recorded_at: string
}

export interface CommoditySummary {
  commodity: string
  commodity_so: string
  latestPrice: number
  prevPrice: number
  unit: string
  change: number   // percentage
  trend: 'up' | 'down' | 'stable'
  history: { date: string; price: number }[]
}

export function useMarketPrices() {
  const [summaries, setSummaries] = useState<CommoditySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('market_prices')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(200)

      if (fetchErr) throw fetchErr

      const rows = (data ?? []) as PriceRecord[]

      // Group by commodity
      const grouped = rows.reduce<Record<string, PriceRecord[]>>((acc, row) => {
        if (!acc[row.commodity]) acc[row.commodity] = []
        acc[row.commodity].push(row)
        return acc
      }, {})

      const result: CommoditySummary[] = Object.entries(grouped).map(([commodity, records]) => {
        const sorted = [...records].sort(
          (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
        )
        const latest = sorted[0]
        const prev = sorted[1] ?? sorted[0]
        const latestPrice = Number(latest.price_usd)
        const prevPrice = Number(prev.price_usd)
        const change = prevPrice > 0 ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0
        const history = sorted
          .slice(0, 30)
          .reverse()
          .map(r => ({
            date: r.recorded_at.slice(0, 10),
            price: Number(r.price_usd),
          }))

        return {
          commodity,
          commodity_so: latest.commodity_so,
          latestPrice,
          prevPrice,
          unit: latest.unit,
          change,
          trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
          history,
        }
      })

      setSummaries(result)
      setLastUpdated(new Date().toLocaleTimeString('so-SO', { hour: '2-digit', minute: '2-digit' }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Qiimaynta soo qaadista ayaa fashilantay'
      console.warn('[useMarketPrices]', msg)
      setError(msg)

      // Fallback static data
      setSummaries([
        { commodity: 'Sorghum', commodity_so: 'Masago',  latestPrice: 0.45, prevPrice: 0.42, unit: 'kg', change: 7.1,  trend: 'up',   history: [] },
        { commodity: 'Maize',   commodity_so: 'Galley',  latestPrice: 0.38, prevPrice: 0.40, unit: 'kg', change: -5.0, trend: 'down', history: [] },
        { commodity: 'Sesame',  commodity_so: 'Simsim',  latestPrice: 1.22, prevPrice: 1.22, unit: 'kg', change: 0.0,  trend: 'stable', history: [] },
        { commodity: 'Bananas', commodity_so: 'Muus',    latestPrice: 0.27, prevPrice: 0.25, unit: 'kg', change: 8.0,  trend: 'up',   history: [] },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addPrice = useCallback(async (commodity: string, commodity_so: string, price_usd: number, unit: string) => {
    const { error: insertErr } = await supabase.from('market_prices').insert({
      commodity, commodity_so, price_usd, unit,
      market: 'Bakaaraha', region: 'Mogadishu',
    })
    if (!insertErr) await load()
    return { success: !insertErr, error: insertErr?.message }
  }, [load])

  return { summaries, loading, error, lastUpdated, refetch: load, addPrice }
}
