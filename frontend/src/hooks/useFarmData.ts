import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { LivestockRecord, CropRecord } from '@/types'

export function useFarmData() {
  const [livestock, setLivestock] = useState<LivestockRecord[]>([])
  const [crops, setCrops] = useState<CropRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLivestock = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('livestock')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      if (data) setLivestock(data as LivestockRecord[])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch livestock data'
      console.warn('[Supabase Livestock Fetch Error]', msg)
      setError(msg)
    }
  }, [])

  const fetchCrops = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      if (data) setCrops(data as CropRecord[])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch crops data'
      console.warn('[Supabase Crops Fetch Error]', msg)
      setError(msg)
    }
  }, [])

  const refetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    await Promise.all([fetchLivestock(), fetchCrops()])
    setIsLoading(false)
  }, [fetchLivestock, fetchCrops])

  useEffect(() => {
    refetchAll()
  }, [refetchAll])

  return {
    livestock,
    crops,
    isLoading,
    error,
    refetchLivestock: fetchLivestock,
    refetchCrops: fetchCrops,
    refetchAll,
  }
}
