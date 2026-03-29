'use client'
import { useState } from 'react'
import { BarChart2, Waves, Droplets, Zap } from 'lucide-react'
import { patchSection } from '@/lib/api'

interface Pump extends Record<string, unknown> {
  blood_flow_rate: number
  dialysate_flow_rate: number
  ultrafiltration_rate: number
  pump_state: string
}
interface Dialysate {
  conductivity: number
  temperature: number
  ph: number
}
interface Props { pump: Pump; dialysate: Dialysate; onUpdate: (pump: Pump) => void }

const ParamRow = ({
  icon: Icon,
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  icon: React.ElementType
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) => (
  <div className="py-3 border-b border-border last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="text-xl font-bold font-mono">
          {value} <span className="text-xs font-normal text-muted">{unit}</span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-border flex items-center justify-center text-muted">
        <Icon size={14} />
      </div>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-dark"
    />
    <div className="flex justify-between text-[10px] text-muted mt-1">
      <span>{min}</span><span>{max}</span>
    </div>
  </div>
)

export default function DialysatePanel({ pump, dialysate, onUpdate }: Props) {
  const [local, setLocal] = useState(pump)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof Pump, val: number) => {
    const next = { ...local, [field]: val }
    setLocal(next)
    onUpdate(next)
  }

  const setPumpState = async (state: string) => {
    const next = { ...local, pump_state: state }
    setLocal(next)
    onUpdate(next)
    setSaving(true)
    try { await patchSection('pump', next) } finally { setSaving(false) }
  }

  const save = async () => {
    setSaving(true)
    try { await patchSection('pump', local) } finally { setSaving(false) }
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-5">
      <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-3">Dialysate Parameters</div>

      <ParamRow icon={BarChart2} label="Blood Flow (Qb)"      value={local.blood_flow_rate}      unit="ml/min" min={100} max={500} step={10} onChange={(v) => update('blood_flow_rate', v)} />
      <ParamRow icon={Waves}     label="Dialysate Flow (Qd)"  value={local.dialysate_flow_rate}  unit="ml/min" min={200} max={800} step={10} onChange={(v) => update('dialysate_flow_rate', v)} />
      <ParamRow icon={Droplets}  label="UF Rate"              value={local.ultrafiltration_rate} unit="ml/hr"  min={0}   max={500} step={10} onChange={(v) => update('ultrafiltration_rate', v)} />
      <div className="py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted">Conductivity</div>
            <div className="text-xl font-bold font-mono">
              {dialysate.conductivity} <span className="text-xs font-normal text-muted">mS/cm</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-border flex items-center justify-center text-muted">
            <Zap size={14} />
          </div>
        </div>
      </div>

      {/* pump state */}
      <div className="pt-3 space-y-2">
        <div className="text-xs text-muted mb-2">Pump State</div>
        <div className="flex gap-2">
          {(['START','HOLD','STOP'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setPumpState(s)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                local.pump_state === s
                  ? s === 'STOP' ? 'bg-critical text-white' : s === 'HOLD' ? 'bg-warning text-white' : 'bg-dark text-white'
                  : 'bg-border text-muted hover:bg-dark/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="w-full mt-2 py-2.5 rounded-xl bg-dark text-white text-xs font-semibold hover:bg-dark/80 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Apply Changes'}
        </button>
      </div>
    </div>
  )
}
