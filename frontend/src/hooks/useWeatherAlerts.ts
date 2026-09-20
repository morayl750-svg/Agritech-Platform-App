import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface WeatherAlert {
  id: string
  user_id: string
  region: string
  phone_number: string | null
  alert_types: string[]
  threshold_mm: number
  is_active: boolean
  last_alerted_at: string | null
  created_at: string
}

export interface CreateWeatherAlertPayload {
  region: string
  phone_number: string
  alert_types: string[]
  threshold_mm: number
}

export function useWeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('user_id', 'default-user')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setAlerts(data ?? [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ogeysiisyada soo qaadista ayaa fashilantay'
      console.warn('[useWeatherAlerts]', msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const createAlert = useCallback(
    async (payload: CreateWeatherAlertPayload): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data, error: insertErr } = await supabase
          .from('weather_alerts')
          .insert({
            ...payload,
            user_id: 'default-user',
            is_active: true,
          })
          .select()
          .single()

        if (insertErr) throw insertErr
        if (data) setAlerts((prev) => [data as WeatherAlert, ...prev])
        return { success: true }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Ogeysiiska abuurista ayaa fashilantay'
        return { success: false, error: msg }
      }
    },
    []
  )

  const toggleAlert = useCallback(async (id: string, is_active: boolean) => {
    // Optimistic update
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_active } : a)))
    try {
      const { error: updateErr } = await supabase
        .from('weather_alerts')
        .update({ is_active })
        .eq('id', id)
      if (updateErr) throw updateErr
    } catch (err) {
      // Revert on failure
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !is_active } : a)))
      console.warn('[toggleAlert]', err)
    }
  }, [])

  const deleteAlert = useCallback(async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    try {
      const { error: deleteErr } = await supabase
        .from('weather_alerts')
        .delete()
        .eq('id', id)
      if (deleteErr) throw deleteErr
    } catch (err) {
      console.warn('[deleteAlert]', err)
      // Re-fetch to restore state
      fetchAlerts()
    }
  }, [fetchAlerts])

  return {
    alerts,
    loading,
    error,
    createAlert,
    toggleAlert,
    deleteAlert,
    refetch: fetchAlerts,
  }
}
