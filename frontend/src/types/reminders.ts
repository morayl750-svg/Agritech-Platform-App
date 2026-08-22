export type ReminderCategory =
  | 'irrigation'
  | 'harvest'
  | 'weather_alert'
  | 'vaccination'
  | 'fertilizer'

export type ReminderUrgency = 'emergency' | 'warning' | 'normal'

export interface FarmerReminder {
  id: string
  category: ReminderCategory
  title: string
  description: string
  urgency: ReminderUrgency
  target: string
  dueDate: string
  isDone: boolean
  created_at: string
}
