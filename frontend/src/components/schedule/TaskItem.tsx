import { CheckCircle2, Circle, Droplets, Sparkles, Leaf, Search, Wheat } from 'lucide-react'
import type { ScheduleTask } from '@/hooks/useCropSchedule'
import { cn } from '@/lib/cn'

const TASK_META = {
  plant: { icon: Leaf, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
  water: { icon: Droplets, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
  fertilize: { icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
  inspect: { icon: Search, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
  harvest: { icon: Wheat, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50' },
  other: { icon: Leaf, color: 'text-gray-500 bg-gray-50 dark:bg-neutral-800' },
}

interface TaskItemProps {
  task: ScheduleTask
  onToggle: (id: string, done: boolean) => void
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const isOverdue = !task.is_done && new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0))
  const meta = TASK_META[task.task_type] || TASK_META.other
  const Icon = meta.icon

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-2xl border transition-all',
        task.is_done
          ? 'bg-gray-50/60 dark:bg-neutral-900/40 border-gray-200/50 dark:border-neutral-800/50 opacity-60'
          : isOverdue
          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
          : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 shadow-2xs hover:border-gray-300'
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id, !task.is_done)}
        className="shrink-0 p-1 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
        aria-label={task.is_done ? 'Mark as undone' : 'Mark as done'}
      >
        {task.is_done ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', meta.color)}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs md:text-sm font-semibold truncate',
            task.is_done
              ? 'line-through text-gray-400 dark:text-neutral-500'
              : 'text-gray-900 dark:text-white'
          )}
        >
          {task.task_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={cn(
              'text-[11px] font-medium',
              isOverdue
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-neutral-400'
            )}
          >
            {isOverdue ? '⚠️ Xilligii waa dhaafay: ' : 'Taariikhda: '}
            {task.due_date}
          </span>
          {task.notes && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 truncate max-w-[140px]">
              {task.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
