'use client'

interface Session {
  elapsed_time: string
  remaining_time: string
  target_time: string
  completion_percent: number
}
interface Meta {
  patient_id: string
  bed: string
  physician: string
  system_status: string
}

interface Props { meta: Meta; session: Session }

export default function PatientHeader({ meta, session }: Props) {
  const r = session.completion_percent / 100
  const circ = 2 * Math.PI * 20
  const dash = circ * (1 - r)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-4">
      {/* left */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="bg-accent text-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {meta.system_status === 'RUNNING' ? 'Active Session' : meta.system_status}
          </span>
          <span className="text-muted text-sm">{meta.bed}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Kaelen Vance{' '}
          <span className="text-muted font-normal text-base md:text-lg">ID: {meta.patient_id}</span>
        </h1>
      </div>

      {/* progress */}
      <div className="flex items-center gap-4 bg-surface rounded-2xl px-4 py-3 border border-border shrink-0">
        <div>
          <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-0.5">Treatment Progress</div>
          <div className="text-xl font-bold font-mono">
            {session.elapsed_time}
            <span className="text-muted font-normal text-sm"> / {session.target_time}</span>
          </div>
        </div>
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
            <circle cx="22" cy="22" r="20" fill="none" stroke="#E5E3DC" strokeWidth="3.5" />
            <circle
              cx="22" cy="22" r="20" fill="none"
              stroke="#1A1A1A" strokeWidth="3.5"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {session.completion_percent}%
          </div>
        </div>
      </div>
    </div>
  )
}
