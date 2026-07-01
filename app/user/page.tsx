'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Activity, LogOut, Calendar, Clock, User, Heart, Info, Stethoscope,
  Wind, Droplets, Eye, EyeOff, ShieldCheck, CheckCircle2, Bell,
} from 'lucide-react'

interface PatientEvent {
  time: string
  message: string
}

const SESSION = {
  elapsed_time: '02:15:30',
  remaining_time: '01:44:30',
  target_time: '04:00:00',
  completion_percent: 56,
}

const META = {
  patient_id: 'PT-04821',
  bed: 'Bed 04 • Station A',
  physician: 'Dr. Aris Thorne',
  system_status: 'RUNNING',
}

const VITALS = {
  systolic: 122,
  diastolic: 80,
  heartRate: 78,
  spo2: 98,
  temperature: 36.8,
}

const RESPIRATION = {
  rate: 16, // breaths per minute — basic view only
}

const FLUID = {
  uf_removed: 1450, // mL
  uf_goal: 2500,    // mL
  targetDryWeight: 74.0, // kg
}

// Patient-friendly events only — no clinical/technical alarm language
const EVENTS: PatientEvent[] = [
  { time: '09:02', message: 'Your treatment session started' },
  { time: '09:15', message: 'Blood pressure checked — normal' },
  { time: '10:00', message: 'Fluid removal is on track' },
  { time: '10:45', message: 'Halfway through your session' },
  { time: '11:10', message: 'Vitals checked — all stable' },
]

export default function PatientDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [patientName, setPatientName] = useState('Valued Patient')
  const [patientEmail, setPatientEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [idMasked, setIdMasked] = useState(true)

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

  const circ = 2 * Math.PI * 20
  const dash = circ * (1 - SESSION.completion_percent / 100)
  const fluidPct = Math.min((FLUID.uf_removed / FLUID.uf_goal) * 100, 100)
  const maskedId = META.patient_id.slice(0, 3) + '-' + '•'.repeat(META.patient_id.split('-')[1]?.length || 4)

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
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left/Middle Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Meta / Session Overview Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-2xl group-hover:bg-accent/10 transition-colors" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-accent text-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {META.system_status === 'RUNNING' ? 'Active Session' : META.system_status}
                  </span>
                  <span className="text-muted text-xs">{META.bed}</span>
                </div>
                <h1 className="text-lg font-bold tracking-wider uppercase flex items-center gap-2">
                  <Stethoscope size={18} className="text-dark" />
                  Treatment Overview
                </h1>
                <button
                  onClick={() => setIdMasked(!idMasked)}
                  className="mt-1 flex items-center gap-1.5 text-[10px] text-muted font-semibold tracking-wider uppercase hover:text-dark transition-colors"
                >
                  {idMasked ? <EyeOff size={12} /> : <Eye size={12} />}
                  Patient ID: {idMasked ? maskedId : META.patient_id}
                </button>
              </div>

              {/* Progress ring */}
              <div className="flex items-center gap-4 bg-bg/50 rounded-2xl px-4 py-3 border border-border shrink-0">
                <div>
                  <div className="text-[9px] text-muted uppercase tracking-wider font-bold mb-0.5">Progress</div>
                  <div className="text-lg font-bold font-mono">
                    {SESSION.elapsed_time}
                    <span className="text-muted font-normal text-xs"> / {SESSION.target_time}</span>
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
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {SESSION.completion_percent}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-bg/40 border border-border p-4 rounded-xl flex items-center gap-3">
                <User className="text-muted" size={18} />
                <div>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider">Care Physician</span>
                  <span className="text-xs font-bold text-dark">{META.physician}</span>
                </div>
              </div>
              <div className="bg-bg/40 border border-border p-4 rounded-xl flex items-center gap-3">
                <Clock className="text-muted" size={18} />
                <div>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider">Time Remaining</span>
                  <span className="text-xs font-bold text-dark">{SESSION.remaining_time}</span>
                </div>
              </div>
              <div className="bg-bg/40 border border-border p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck className="text-muted" size={18} />
                <div>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider">System Status</span>
                  <span className="text-xs font-bold text-dark capitalize">{META.system_status.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals — Full Access */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Heart size={16} className="text-dark" />
                Your Vitals
              </h2>
              <p className="text-xs text-muted">Live readings recorded during your current session.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-bg/40 border border-border p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider mb-1">Blood Pressure</span>
                <span className="text-lg font-bold">{VITALS.systolic}/{VITALS.diastolic}</span>
                <span className="text-[9px] text-muted ml-1">mmHg</span>
                <span className="inline-flex mt-2 px-2 py-0.5 bg-success/15 text-success rounded text-[8px] font-bold uppercase">Normal</span>
              </div>
              <div className="bg-bg/40 border border-border p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider mb-1">Heart Rate</span>
                <span className="text-lg font-bold">{VITALS.heartRate}</span>
                <span className="text-[9px] text-muted ml-1">bpm</span>
                <span className="inline-flex mt-2 px-2 py-0.5 bg-success/15 text-success rounded text-[8px] font-bold uppercase">Stable</span>
              </div>
              <div className="bg-bg/40 border border-border p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider mb-1">O₂ Saturation</span>
                <span className="text-lg font-bold">{VITALS.spo2}%</span>
                <span className="inline-flex mt-2 px-2 py-0.5 bg-success/15 text-success rounded text-[8px] font-bold uppercase">Stable</span>
              </div>
              <div className="bg-bg/40 border border-border p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider mb-1">Temperature</span>
                <span className="text-lg font-bold">{VITALS.temperature}</span>
                <span className="text-[9px] text-muted ml-1">°C</span>
                <span className="inline-flex mt-2 px-2 py-0.5 bg-success/15 text-success rounded text-[8px] font-bold uppercase">Normal</span>
              </div>
            </div>

            {/* Respiration — Basic view only (rate only) */}
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              <div className="h-9 w-9 bg-info/10 text-info rounded-xl flex items-center justify-center shrink-0">
                <Wind size={16} />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Respiratory Rate</span>
                <span className="text-sm font-bold">{RESPIRATION.rate} <span className="text-[10px] text-muted font-semibold">breaths/min</span></span>
              </div>
            </div>
          </div>

          {/* Events — Patient-friendly only */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Bell size={16} className="text-dark" />
                Session Updates
              </h2>
            </div>
            <div className="space-y-2">
              {EVENTS.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="text-xs text-muted font-mono w-10 shrink-0 pt-0.5">{ev.time}</div>
                  <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight">{ev.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Fluid Balance — Full Access */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              <Droplets size={16} className="text-dark" />
              Fluid Balance
            </h2>

            <div>
              <div className="text-[10px] text-muted uppercase tracking-wider font-medium mb-1">Total Fluid Removed</div>
              <div className="text-3xl font-bold font-mono mb-1">
                {(FLUID.uf_removed / 1000).toFixed(2)}
                <span className="text-sm font-normal text-muted ml-1">L</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-dark rounded-full transition-all duration-500"
                  style={{ width: `${fluidPct}%` }}
                />
              </div>
              <div className="text-[10px] text-muted mt-1">Target: {(FLUID.uf_goal / 1000).toFixed(2)} L</div>
            </div>

            <div className="bg-bg/40 border border-border p-4 rounded-xl flex justify-between items-center">
              <div>
                <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Target Dry Weight</span>
                <span className="text-sm font-bold">{FLUID.targetDryWeight.toFixed(1)} kg</span>
              </div>
              <span className="text-[10px] text-muted font-bold">Goal</span>
            </div>
          </div>

          {/* Guidance */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              <Info size={16} className="text-dark" />
              Physician Guidelines
            </h2>
            <p className="text-[10px] text-muted leading-relaxed">
              Maintain fluid intake below 1.5 liters per day. Report any swelling in hands, feet, or face to the clinic immediately.
            </p>
            <div className="border-t border-border/80 pt-4 flex items-start gap-2 text-[10px] text-muted leading-normal">
              <Calendar size={14} className="shrink-0 mt-0.5" />
              <span>Your next scheduled session is Friday, June 20 at 09:00 AM. Please arrive 15 minutes early.</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-[10px] text-muted flex flex-wrap justify-between gap-2 uppercase tracking-wider max-w-7xl mx-auto w-full">
        <span>HemoSync Patient Portal v2.4</span>
        <span>Secure Patient Portal</span>
      </footer>
    </div>
  )
}
