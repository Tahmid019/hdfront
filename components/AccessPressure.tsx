'use client'

interface Props { value: number }

export default function AccessPressure({ value }: Props) {
  const isAlert = value < -200 || value > 200

  return (
    <div className={`rounded-2xl p-4 md:p-5 flex items-center justify-between ${
      isAlert ? 'bg-critical' : 'bg-dark'
    } text-white`}>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/60 font-medium mb-1">Access Pressure</div>
        <div className="text-4xl font-bold font-mono">
          {value} <span className="text-sm font-normal text-white/60">mmHg</span>
        </div>
        {isAlert && <div className="text-xs mt-1 text-white/80">⚠ Pressure alert</div>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2v16M4 8l6-6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14l6 4 6-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}
