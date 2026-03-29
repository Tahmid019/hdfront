'use client'

interface FluidBalance { uf_removed: number; uf_goal: number }
interface Props { fluid: FluidBalance; ktv?: number }

export default function SessionAnalytics({ fluid, ktv = 1.18 }: Props) {
  const fluidPct = Math.min((fluid.uf_removed / fluid.uf_goal) * 100, 100)
  const ktvPct   = Math.min((ktv / 1.4) * 100, 100)

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-5">
      <div className="font-semibold text-sm mb-4">Session Analytics</div>

      <div className="grid grid-cols-2 gap-4">
        {/* fluid */}
        <div>
          <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-1">Total Fluid Removed</div>
          <div className="text-3xl font-bold font-mono mb-1">
            {(fluid.uf_removed / 1000).toFixed(2)}
            <span className="text-sm font-normal text-muted ml-1">L</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-dark rounded-full transition-all duration-500"
              style={{ width: `${fluidPct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted mt-1">Target: {(fluid.uf_goal / 1000).toFixed(2)} L</div>
        </div>

        {/* ktv */}
        <div>
          <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-1">Kt/V (Estimate)</div>
          <div className="text-3xl font-bold font-mono mb-1">
            {ktv.toFixed(2)}
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${ktvPct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted mt-1">Target: &gt; 1.40</div>
        </div>
      </div>

      {/* nursing */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <div className="flex gap-1">
          <div className="w-7 h-7 rounded-full bg-dark text-white text-[10px] font-bold flex items-center justify-center">AT</div>
          <div className="w-7 h-7 rounded-full bg-muted text-white text-[10px] font-bold flex items-center justify-center">RN</div>
        </div>
        <span className="text-xs text-muted uppercase tracking-wider font-medium">Nursing Staff Assigned</span>
      </div>
    </div>
  )
}
