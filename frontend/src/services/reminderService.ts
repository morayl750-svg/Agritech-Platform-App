import type { FarmerReminder } from '@/types/reminders'

const INITIAL_REMINDERS: FarmerReminder[] = [
  {
    id: 'REM-101',
    category: 'weather_alert',
    title: 'Digniin Degdeg ah: Kuleyl 35°C & Dabayl Xooggan',
    description: 'Banaadir & Shabeellaha Dhexe waxaa keshi la filayaa dabayl xooggan oo biyo-dhac ah. Waraabi dhirta yaryar fiidkii.',
    urgency: 'emergency',
    target: 'Gobollada Banaadir & Shabeellaha Dhexe',
    dueDate: 'Maanta 02:00 PM',
    isDone: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'REM-102',
    category: 'irrigation',
    title: 'Waqtiga Waraabka Beerta (Galleyda)',
    description: 'Waraabi Plot #4 (Galleyda) subaxdii hore ama fiidkii si aad u baadbaadiso 30% biyaha evapo-transpiration-ka.',
    urgency: 'warning',
    target: 'Plot #4 — Galleyda',
    dueDate: 'Khamiis 05:30 PM',
    isDone: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'REM-103',
    category: 'harvest',
    title: 'Xilliga Goosashada Sisinta (Sesame)',
    description: 'Sisinta Plot #2 waxay gaartay 90% bisayl. Diyaari shaqaalaha goosashada kahor roobka Deyrta.',
    urgency: 'warning',
    target: 'Plot #2 — Sisinta',
    dueDate: '3 Maalmood ka dib',
    isDone: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'REM-104',
    category: 'vaccination',
    title: 'Talaalka Geela & Lo\'da (Livestock Vaccination)',
    description: 'Talaalka sannadlaha ah ee geela iyo lo\'da dhanka cudurada faafa. Wuxuu dhacayaa Sabtida.',
    urgency: 'normal',
    target: 'Xoolaha Plot #1 (Geel & Lo\')',
    dueDate: 'Sabti 09:00 AM',
    isDone: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

let remindersStore: FarmerReminder[] = [...INITIAL_REMINDERS]

export function getReminders(): FarmerReminder[] {
  return [...remindersStore]
}

export function addReminder(reminder: Omit<FarmerReminder, 'id' | 'created_at' | 'isDone'>): FarmerReminder {
  const newRem: FarmerReminder = {
    ...reminder,
    id: `REM-${Math.floor(1000 + Math.random() * 9000)}`,
    isDone: false,
    created_at: new Date().toISOString(),
  }
  remindersStore = [newRem, ...remindersStore]
  return newRem
}

export function toggleReminderDone(id: string): FarmerReminder[] {
  remindersStore = remindersStore.map((r) => (r.id === id ? { ...r, isDone: !r.isDone } : r))
  return [...remindersStore]
}

export function deleteReminder(id: string): FarmerReminder[] {
  remindersStore = remindersStore.filter((r) => r.id !== id)
  return [...remindersStore]
}
