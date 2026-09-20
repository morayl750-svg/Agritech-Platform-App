import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { LivestockRecord, CropRecord } from '@/types'

const DEMO_LIVESTOCK: LivestockRecord[] = [
  {
    id: 'live-1',
    animal_type: 'Camel',
    count: 14,
    health_status: 'Healthy',
    last_vaccination: '2026-08-10',
    notes: 'Geela caanaha ee qaybta Afgooye, xaalkoodu aad buu u wanaagsan yahay.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'live-2',
    animal_type: 'Cattle',
    count: 28,
    health_status: 'Healthy',
    last_vaccination: '2026-07-25',
    notes: "Lo'da la tallaalay xilliga roobka ka hor.",
    created_at: new Date().toISOString(),
  },
  {
    id: 'live-3',
    animal_type: 'Goat',
    count: 45,
    health_status: 'Recovering',
    last_vaccination: '2026-09-01',
    notes: 'Qayb ka mid ah oo lagu daweeyay daawada dirxiga.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'live-4',
    animal_type: 'Sheep',
    count: 32,
    health_status: 'Healthy',
    last_vaccination: '2026-08-20',
    notes: 'Idaha cad-cad oo ku jira daaqsin wanaagsan.',
    created_at: new Date().toISOString(),
  },
]

const DEMO_CROPS: CropRecord[] = [
  {
    id: 'crop-1',
    crop_name: 'Galayda Safka Ah (Maize)',
    plot_number: 'Plot A1',
    status: 'Growing',
    planted_date: '2026-08-01',
    expected_yield: '18 MT',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crop-2',
    crop_name: 'Sisin Cad (Sesame)',
    plot_number: 'Plot B2',
    status: 'Ready',
    planted_date: '2026-07-15',
    expected_yield: '12 MT',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crop-3',
    crop_name: 'Moos & Cambe (Banana)',
    plot_number: 'Plot C3',
    status: 'Growing',
    planted_date: '2026-06-10',
    expected_yield: '25 MT',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crop-4',
    crop_name: 'Sorghum (Haruur Cad)',
    plot_number: 'Plot D4',
    status: 'Harvested',
    planted_date: '2026-05-20',
    expected_yield: '15 MT',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crop-5',
    crop_name: 'Khadarta (Tomatoes & Onions)',
    plot_number: 'Plot E5',
    status: 'Planted',
    planted_date: '2026-09-05',
    expected_yield: '8 MT',
    created_at: new Date().toISOString(),
  },
]

export function useFarmData() {
  const [livestock, setLivestock] = useState<LivestockRecord[]>(DEMO_LIVESTOCK)
  const [crops, setCrops] = useState<CropRecord[]>(DEMO_CROPS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLivestock = useCallback(async () => {
    try {
      if (supabase) {
        const { data } = await supabase
          .from('livestock')
          .select('*')
          .order('created_at', { ascending: false })

        if (Array.isArray(data) && data.length > 0) {
          setLivestock(data as LivestockRecord[])
          return
        }
      }
      setLivestock(DEMO_LIVESTOCK)
    } catch (err) {
      console.warn('[Supabase Livestock Fetch Warning]', err)
      setLivestock(DEMO_LIVESTOCK)
    }
  }, [])

  const fetchCrops = useCallback(async () => {
    try {
      if (supabase) {
        const { data } = await supabase
          .from('crops')
          .select('*')
          .order('created_at', { ascending: false })

        if (Array.isArray(data) && data.length > 0) {
          setCrops(data as CropRecord[])
          return
        }
      }
      setCrops(DEMO_CROPS)
    } catch (err) {
      console.warn('[Supabase Crops Fetch Warning]', err)
      setCrops(DEMO_CROPS)
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
