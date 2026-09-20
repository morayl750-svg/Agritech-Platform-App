import { useState, useEffect, useCallback } from 'react'
import { addDays, format } from 'date-fns'
import { supabase } from '@/lib/supabase'

export interface CropSchedule {
  id: string
  crop_name: string
  plot_name: string
  region: string
  planting_date: string
  estimated_harvest_date: string
  watering_interval_days: number
  status: 'upcoming' | 'active' | 'harvested' | 'failed'
  notes: string | null
}

export interface ScheduleTask {
  id: string
  schedule_id: string
  task_type: 'plant' | 'water' | 'fertilize' | 'inspect' | 'harvest' | 'other'
  task_name: string
  due_date: string
  is_done: boolean
  notes: string | null
}

export function useCropSchedule() {
  const [schedules, setSchedules] = useState<CropSchedule[]>([])
  const [tasks, setTasks] = useState<ScheduleTask[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: schedData }, { data: taskData }] = await Promise.all([
      supabase.from('crop_schedule').select('*').order('planting_date', { ascending: true }),
      supabase.from('schedule_tasks').select('*').order('due_date', { ascending: true }),
    ])

    if (schedData && schedData.length > 0) {
      setSchedules(schedData)
      setTasks(taskData || [])
    } else {
      // Seed default sample schedules if database is fresh
      const defaultSched: CropSchedule[] = [
        {
          id: 'sched-01',
          crop_name: 'Mesego (Sorghum)',
          plot_name: 'Beerta Afgooye - Qeybta 1',
          region: 'Lower Shabelle',
          planting_date: format(new Date(), 'yyyy-MM-dd'),
          estimated_harvest_date: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
          watering_interval_days: 4,
          status: 'active',
          notes: 'Nooca abuurka adkeysi u leh abaarta.',
        },
        {
          id: 'sched-02',
          crop_name: 'Galley (Maize)',
          plot_name: 'Beerta Jowhar - Qeybta Webiga',
          region: 'Middle Shabelle',
          planting_date: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
          estimated_harvest_date: format(addDays(new Date(), 75), 'yyyy-MM-dd'),
          watering_interval_days: 3,
          status: 'active',
          notes: 'Waraabka kanaalka webiga Shabelle.',
        },
      ]

      const defaultTasks: ScheduleTask[] = [
        {
          id: 'task-01',
          schedule_id: 'sched-01',
          task_type: 'plant',
          task_name: 'Mesego beerista qeybta 1',
          due_date: format(new Date(), 'yyyy-MM-dd'),
          is_done: true,
          notes: null,
        },
        {
          id: 'task-02',
          schedule_id: 'sched-01',
          task_type: 'water',
          task_name: 'Waraabka koowaad ee abuurka',
          due_date: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
          is_done: false,
          notes: null,
        },
        {
          id: 'task-03',
          schedule_id: 'sched-02',
          task_type: 'fertilize',
          task_name: 'Ku darista bacriminta Urea',
          due_date: format(new Date(), 'yyyy-MM-dd'),
          is_done: false,
          notes: '50kg/Hectare',
        },
      ]

      setSchedules(defaultSched)
      setTasks(defaultTasks)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createSchedule = async (payload: Omit<CropSchedule, 'id'>) => {
    const { data, error } = await supabase
      .from('crop_schedule')
      .insert(payload)
      .select()
      .single()

    if (!error && data) {
      setSchedules((prev) => [...prev, data as CropSchedule])

      // Generate automated tasks
      const autoTasks = generateAutoTasks(data as CropSchedule)
      const { data: newTasks } = await supabase
        .from('schedule_tasks')
        .insert(autoTasks)
        .select()

      if (newTasks) {
        setTasks((prev) => [...prev, ...(newTasks as ScheduleTask[])])
      }
      return { data, error: null }
    } else {
      // Local fallback
      const localId = `sched-${Date.now()}`
      const localSched: CropSchedule = { ...payload, id: localId }
      setSchedules((prev) => [...prev, localSched])
      const autoTasks = generateAutoTasks(localSched).map((t, idx) => ({
        ...t,
        id: `task-${Date.now()}-${idx}`,
      }))
      setTasks((prev) => [...prev, ...autoTasks])
      return { data: localSched, error: null }
    }
  }

  const toggleTask = async (taskId: string, is_done: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_done } : t)))
    await supabase.from('schedule_tasks').update({ is_done }).eq('id', taskId)
  }

  return { schedules, tasks, loading, createSchedule, toggleTask, reload: loadData }
}

function generateAutoTasks(schedule: CropSchedule): Omit<ScheduleTask, 'id'>[] {
  const tasks: Omit<ScheduleTask, 'id'>[] = []
  const planting = new Date(schedule.planting_date)
  const harvest = new Date(schedule.estimated_harvest_date)
  const daysTotal = Math.max(1, Math.round((harvest.getTime() - planting.getTime()) / 86400000))

  // 1. Planting
  tasks.push({
    schedule_id: schedule.id,
    task_type: 'plant',
    task_name: `${schedule.crop_name} beer`,
    due_date: schedule.planting_date,
    is_done: false,
    notes: `Bilaabidda beerta ${schedule.plot_name}`,
  })

  // 2. Watering tasks (intervals)
  const interval = Math.max(2, schedule.watering_interval_days || 3)
  let waterDate = addDays(planting, interval)
  let count = 1
  while (waterDate < harvest && count <= 8) {
    tasks.push({
      schedule_id: schedule.id,
      task_type: 'water',
      task_name: `${schedule.crop_name} waraabi (Wareega ${count})`,
      due_date: format(waterDate, 'yyyy-MM-dd'),
      is_done: false,
      notes: null,
    })
    waterDate = addDays(waterDate, interval)
    count++
  }

  // 3. Inspection / Weeding
  tasks.push({
    schedule_id: schedule.id,
    task_type: 'inspect',
    task_name: `${schedule.crop_name} baaritaan & haramayn`,
    due_date: format(addDays(planting, Math.round(daysTotal / 3)), 'yyyy-MM-dd'),
    is_done: false,
    notes: 'Hubinta cayayaanka iyo baabi’inta haramaha',
  })

  // 4. Fertilizing
  tasks.push({
    schedule_id: schedule.id,
    task_type: 'fertilize',
    task_name: `${schedule.crop_name} bacrimin (Urea / DAP)`,
    due_date: format(addDays(planting, Math.round(daysTotal / 2)), 'yyyy-MM-dd'),
    is_done: false,
    notes: 'Bacriminta labaad xilliga korriinka',
  })

  // 5. Harvest
  tasks.push({
    schedule_id: schedule.id,
    task_type: 'harvest',
    task_name: `${schedule.crop_name} goosasho (Harvest)`,
    due_date: schedule.estimated_harvest_date,
    is_done: false,
    notes: `Goosashada rasmiga ah ee ${schedule.plot_name}`,
  })

  return tasks
}
