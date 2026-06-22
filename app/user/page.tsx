'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, LogOut, Calendar, Clock, User, Heart, Info, Clipboard } from 'lucide-react'

interface HealthMetric {
  date: string
  systolic: number
  diastolic: number
  weight: number // in kg
  fluidRemoved: number // in mL
}

const HISTORIC_METRICS: HealthMetric[] = [
  { date: 'June 18, 2026', systolic: 122, diastolic: 80, weight: 74.2, fluidRemoved: 2200 },
  { date: 'June 15, 2026', systolic: 124, diastolic: 82, weight: 75.0, fluidRemoved: 2500 },
  { date: 'June 11, 2026', systolic: 118, diastolic: 76, weight: 74.8, fluidRemoved: 2000 },
]

export default function PatientDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [patientName, setPatientName] = useState('Valued Patient')
  const [patientEmail, setPatientEmail] = useState('')
  const [metrics] = useState<HealthMetric[]>(HISTORIC_METRICS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setPatientEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) {
          setPatientName(profile.full_name)
        }
      }
    }
    loadProfile()
  }, [supabase])

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg text-dark font-sans flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
            <span className="block text-[9px] text-muted tracking-wider uppercase font-semibold">Patient Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <div className="h-8 w-8 bg-accent/20 rounded-full flex items-center justify-center text-dark font-bold text-xs uppercase">
              {patientName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold uppercase">{patientName}</span>
              <span className="block text-[9px] text-muted tracking-wider lowercase">{patientEmail}</span>
            </div>
          </div>
          <button
            id="patient-signout-btn"
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-dark transition-colors disabled:opacity-50"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left/Middle Columns: Next Session & History (Span 2) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Next Session Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-2xl group-hover:bg-accent/10 transition-colors" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-accent/20 text-dark rounded-xl flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider uppercase">Next Treatment Session</h1>
                <span className="text-[10px] text-muted uppercase font-semibold">Hemodialysis Schedule</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg/40 border border-border p-4 rounded-xl flex items-center gap-3">
                <Clock className="text-muted" size={18} />
                <div>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider">Date & Time</span>
                  <span className="text-xs font-bold text-dark">Friday, June 20 at 09:00 AM</span>
                </div>
              </div>

              <div className="bg-bg/40 border border-border p-4 rounded-xl flex items-center gap-3">
                <User className="text-muted" size={18} />
                <div>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider">Care Physician</span>
                  <span className="text-xs font-bold text-dark">Dr. Aris Thorne</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[10px] text-muted flex items-center gap-1.5 leading-normal">
              <Info size={12} className="shrink-0" />
              <span>Please arrive 15 minutes before your scheduled appointment. Bring your records and report any health anomalies.</span>
            </div>
          </div>

          {/* Historic Vitals Logs */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Clipboard size={16} />
                Recent Treatment Summaries
              </h2>
              <p className="text-xs text-muted">A record of your previous completed dialysis sessions.</p>
            </div>

            <div className="space-y-3">
              {metrics.map((log, index) => (
                <div key={index} className="border border-border/75 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 bg-bg/10 hover:bg-bg/30 transition-colors">
                  <div>
                    <span className="block text-xs font-bold text-dark">{log.date}</span>
                    <span className="text-[9px] text-muted tracking-wider uppercase font-semibold">Treatment Node: HD-NODE-001</span>
                  </div>
                  <div className="flex gap-6 text-[10px] text-muted font-semibold uppercase tracking-wider">
                    <div>
                      <span className="block text-[8px] text-muted/80">BP</span>
                      <span className="text-xs font-bold text-dark">{log.systolic}/{log.diastolic} mmHg</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-muted/80">Weight</span>
                      <span className="text-xs font-bold text-dark">{log.weight} kg</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-muted/80">Fluid removed</span>
                      <span className="text-xs font-bold text-dark">{(log.fluidRemoved / 1000).toFixed(1)} L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Support & General Vitals */}
        <div className="space-y-6">
          
          {/* Quick Health Status */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              <Heart size={16} className="text-dark" />
              General Health
            </h2>

            <div className="space-y-4">
              <div className="bg-bg/40 border border-border p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Last Recorded BP</span>
                  <span className="text-sm font-bold">122/80</span>
                  <span className="text-[9px] text-muted ml-1 font-semibold">mmHg</span>
                </div>
                <span className="inline-flex px-2 py-0.5 bg-success/10 text-success rounded text-[9px] font-bold uppercase">Optimal</span>
              </div>

              <div className="bg-bg/40 border border-border p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Target Dry Weight</span>
                  <span className="text-sm font-bold">74.0 kg</span>
                </div>
                <span className="text-[10px] text-muted font-bold">Goal</span>
              </div>
            </div>

            <div className="border-t border-border/80 pt-4">
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Physician Guidelines</span>
              <p className="text-[10px] text-muted leading-relaxed">
                Maintain fluid intake below 1.5 liters per day. Report any swelling in hands, feet, or face to the clinic immediately.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-[10px] text-muted flex flex-wrap justify-between gap-2 uppercase tracking-wider max-w-5xl mx-auto w-full">
        <span>HemoSync Patient Portal v2.4</span>
        <span>Secure Patient Portal</span>
      </footer>
    </div>
  )
}
