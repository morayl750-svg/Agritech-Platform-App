import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface FarmLocation {
  id: string
  user_id: string
  name: string
  type: 'crop_plot' | 'livestock_station' | 'water_source' | 'storage'
  latitude: number
  longitude: number
  region: string
  description: string | null
  area_hectares: number | null
  crop_type: string | null
  livestock_count: number | null
  is_active: boolean
  created_at: string
}

export type FarmLocationType = FarmLocation['type']

export interface CreateFarmLocationPayload {
  name: string
  type: FarmLocationType
  latitude: number
  longitude: number
  region: string
  description?: string
  area_hectares?: number
  crop_type?: string
}

export function useFarmLocations() {
  const [locations, setLocations] = useState<FarmLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('farm_locations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (fetchErr) throw fetchErr
      setLocations(data ?? [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Goobaha soo qaadista ayaa fashilantay'
      console.warn('[useFarmLocations]', msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addLocation = useCallback(async (payload: CreateFarmLocationPayload) => {
    try {
      const { data, error: insertErr } = await supabase
        .from('farm_locations')
        .insert({ ...payload, user_id: 'default-user', is_active: true })
        .select()
        .single()
      if (insertErr) throw insertErr
      if (data) setLocations(prev => [data as FarmLocation, ...prev])
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Khalad' }
    }
  }, [])

  const removeLocation = useCallback(async (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id))
    await supabase.from('farm_locations').update({ is_active: false }).eq('id', id)
  }, [])

  return { locations, loading, error, addLocation, removeLocation, refetch: fetch }
}
