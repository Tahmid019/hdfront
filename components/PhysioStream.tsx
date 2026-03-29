'use client'
import WaveformCanvas from './WaveformCanvas'

interface Vitals {
  heart_rate: number
  blood_pressure: { systolic: number; diastolic: number }
  spo2: number
  temperature: number
  respiratory_rate: number
}
interface Props {
  ecgWave:  number[]
  respWave: number[]
  vitals:   Vitals
  ecgLead:  string
  rhythm:   string
}

const VitalItem = ({ label, value, unit }: { label: string; value: string | number; unit: string }) => (
  <div>
    <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-0.5">{label}</div>
    <div className="text-xl md:text-2xl font-bold font-mono">
      {value}
      <span className="text-xs text-muted font-normal ml-1">{unit}</span>
    </div>
  </div>
)

export default function PhysioStream({ ecgWave, respWave, vitals, ecgLead, rhythm }: Props) {
  const { heart_rate, blood_pressure, spo2, temperature, respiratory_rate } = vitals
  const map = Math.round((blood_pressure.systolic + 2 * blood_pressure.diastolic) / 3)

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">♡</span>
          <span className="font-semibold text-sm">Real-time Physiological Stream</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-border text-dark px-3 py-1 rounded-full font-medium">ECG {ecgLead}</span>
          <span className="text-xs bg-border text-dark px-3 py-1 rounded-full font-medium">SPO2 Wave</span>
        </div>
      </div>

      {/* ecg */}
      <div className="mb-2">
        <WaveformCanvas data={ecgWave} color="#1A1A1A" height={90} value={heart_rate} unit="BPM" />
      </div>

      <div className="border-t border-border/50 my-3" />

      {/* resp */}
      <div className="mb-4">
        <WaveformCanvas data={respWave} color="#6B7280" height={60} value={respiratory_rate} unit="RR/MIN" />
      </div>

      {/* vitals bar */}
      <div className="border-t border-border pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <VitalItem label="Blood Pressure" value={`${blood_pressure.systolic}/${blood_pressure.diastolic}`} unit="mmHg" />
        <VitalItem label="SPO2"           value={spo2}                                                    unit="%" />
        <VitalItem label="Temperature"    value={temperature}                                             unit="°C" />
        <VitalItem label="MAP"            value={map}                                                     unit="mmHg" />
      </div>
    </div>
  )
}
