'use client'
import { useState, useEffect, useCallback } from 'react'
import Sidebar         from '@/components/Sidebar'
import Topbar          from '@/components/Topbar'
import PatientHeader   from '@/components/PatientHeader'
import PhysioStream    from '@/components/PhysioStream'
import DialysatePanel  from '@/components/DialysatePanel'
import AccessPressure  from '@/components/AccessPressure'
import EventLog        from '@/components/EventLog'
import SessionAnalytics from '@/components/SessionAnalytics'
import { useMonitorWS } from '@/hooks/useMonitorWS'
import { fetchSnapshot } from '@/lib/api'

const DEFAULT_STATE = {
  meta: { patient_id: 'HDX-00472', physician: 'Dr. Aris Thorne', bed: 'Bed 04 • Station A', system_status: 'RUNNING' },
  pump: { blood_flow_rate: 350, dialysate_flow_rate: 500, ultrafiltration_rate: 200, heparin_infusion: 1200, pump_state: 'START' },
  ecg:  { lead: '12-Lead', heart_rate: 78, sampling_rate: 25, gain: '10 mm/mV', rhythm: 'Normal Sinus', waveform: [] },
  respiration: { respiratory_rate: 18, tidal_volume: 497, waveform: [], inspiratory_time: 1.4, expiratory_time: 2.4, ie_ratio: '1:1.7', minute_ventilation: 8.4, status: 'Regular' },
  vitals: { heart_rate: 78, blood_pressure: { systolic: 124, diastolic: 82 }, spo2: 98, temperature: 36.8, respiratory_rate: 18 },
  dialysate: { conductivity: 13.8, temperature: 37.0, ph: 7.38, bicarbonate: 32, sodium: 140, potassium: 2.0 },
  session: { elapsed_time: '02:45', remaining_time: '01:15', target_time: '04:00', completion_percent: 70 },
  fluid_balance: { uf_removed: 1720, uf_goal: 2500 },
  events: [
    { time: '14:22', type: 'critical', message: 'Venous Pressure Limit Exceeded — Automatic adjustment initiated. Check catheter placement.' },
    { time: '13:58', type: 'success',  message: 'Vitals Check - Stable. BP: 122/80, HR: 76. No patient distress noted.' },
    { time: '13:30', type: 'info',     message: 'Treatment Started — Target UF: 2.5L. Prescribed time: 4 hours.' },
  ],
}

export default function Dashboard() {
  const [state,      setState]      = useState<typeof DEFAULT_STATE>(DEFAULT_STATE)
  const [ecgWave,    setEcgWave]    = useState<number[]>([])
  const [respWave,   setRespWave]   = useState<number[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connected,  setConnected]  = useState(false)

  // load snapshot once
  useEffect(() => {
    fetchSnapshot()
      .then((data) => setState((prev) => ({ ...prev, ...data })))
      .catch(() => {}) // use defaults on error
  }, [])

  // ws handler
  const handleWS = useCallback((msg: { type: string; data: unknown }) => {
    setConnected(true)
    if (msg.type === 'snapshot') {
      const d = msg.data as typeof DEFAULT_STATE
      setState((prev) => ({ ...prev, ...d }))
    } else if (msg.type === 'wave') {
      const d = msg.data as { ecg_wave_chunk: number[]; resp_wave_chunk: number[] }
      setEcgWave((prev)  => [...prev,  ...(d.ecg_wave_chunk  || [])].slice(-300))
      setRespWave((prev) => [...prev,  ...(d.resp_wave_chunk || [])].slice(-300))
    } else if (msg.type === 'update') {
      setState((prev) => ({ ...prev, ...(msg.data as Partial<typeof DEFAULT_STATE>) }))
    }
  }, [])

  useMonitorWS(handleWS)

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar physician={state.meta.physician} onMenuClick={() => setSidebarOpen(true)} />

        {/* ws status dot */}
        <div className="flex items-center gap-1.5 px-4 md:px-6 py-1 text-[10px] text-muted">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-success' : 'bg-warning'}`} />
          {connected ? 'Live stream connected' : 'Connecting...'}
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <PatientHeader meta={state.meta} session={state.session} />

          {/* grid */}
          <div className="px-4 md:px-6 pb-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
            {/* left column */}
            <div className="space-y-4">
              <PhysioStream
                ecgWave={ecgWave}
                respWave={respWave}
                vitals={state.vitals}
                ecgLead={state.ecg.lead}
                rhythm={state.ecg.rhythm}
              />

              {/* bottom row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EventLog events={state.events as Array<{ time: string; type: 'info'|'warning'|'success'|'critical'; message: string }>} />
                <SessionAnalytics fluid={state.fluid_balance} />
              </div>
            </div>

            {/* right column */}
            <div className="space-y-4">
              <DialysatePanel
                pump={state.pump}
                dialysate={state.dialysate}
                onUpdate={(pump) => setState((prev) => ({ ...prev, pump: { ...prev.pump, ...pump } }))}
              />
              <AccessPressure value={-180} />
            </div>
          </div>
        </div>

        {/* footer */}
        <footer className="border-t border-border px-4 md:px-6 py-3 text-[10px] text-muted flex flex-wrap justify-between gap-2">
          <span>© 2026 HemoSync Pro</span>
          <div className="flex gap-4">
            <button className="hover:text-dark transition-colors">Privacy Policy</button>
            <button className="hover:text-dark transition-colors">Terms of Service</button>
            <button className="hover:text-dark transition-colors">Security Compliance</button>
          </div>
        </footer>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform z-50 text-xl font-bold">
        ✚
      </button>
    </div>
  )
}
