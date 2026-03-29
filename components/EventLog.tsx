'use client'
import { MoreVertical } from 'lucide-react'

interface Event {
  time: string
  type: 'info' | 'warning' | 'success' | 'critical'
  message: string
}
interface Props { events: Event[] }

const dot: Record<string, string> = {
  info:     'bg-info',
  warning:  'bg-warning',
  success:  'bg-success',
  critical: 'bg-critical',
}
const bg: Record<string, string> = {
  info:     '',
  warning:  '',
  success:  '',
  critical: 'bg-critical/5 border-critical/20',
}

export default function EventLog({ events }: Props) {
  const sorted = [...events].reverse().slice(0, 6)

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm">Clinical Event Log</span>
        <button className="text-xs text-muted font-medium hover:text-dark transition-colors">
          VIEW FULL HISTORY →
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map((ev, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl border border-border fade-in ${bg[ev.type] || ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="text-xs text-muted font-mono w-10 shrink-0 pt-0.5">{ev.time}</div>
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot[ev.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight">{ev.message}</div>
            </div>
            <button className="text-muted hover:text-dark shrink-0">
              <MoreVertical size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
