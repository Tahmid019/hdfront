'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, LogOut, Search, User, Stethoscope, Bell, AlertTriangle, RefreshCw, ClipboardList, CheckCircle } from 'lucide-react'

interface PatientSession {
  id: string
  name: string
  bed: string
  status: 'active' | 'scheduled' | 'completed'
  systolic: number
  diastolic: number
  spo2: number
  bloodFlow: number
  dialysateFlow: number
  alert?: string
}

const MOCK_PATIENTS: PatientSession[] = [
  { id: '1', name: 'Emily Vance', bed: 'Bed 04 • Station A', status: 'active', systolic: 124, diastolic: 82, spo2: 98, bloodFlow: 350, dialysateFlow: 500 },
  { id: '2', name: 'Marcus Thorne', bed: 'Bed 02 • Station B', status: 'active', systolic: 110, diastolic: 70, spo2: 95, bloodFlow: 280, dialysateFlow: 500, alert: 'Access pressure approaching low limits' },
  { id: '3', name: 'Sarah Lin', bed: 'Bed 07 • Station C', status: 'scheduled', systolic: 120, diastolic: 80, spo2: 99, bloodFlow: 0, dialysateFlow: 0 },
  { id: '4', name: 'James Carter', bed: 'Bed 01 • Station A', status: 'completed', systolic: 118, diastolic: 76, spo2: 97, bloodFlow: 0, dialysateFlow: 0 },
]

export default function DoctorDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [doctorName, setDoctorName] = useState('Medical Doctor')
  const [doctorEmail, setDoctorEmail] = useState('')
  const [patients, setPatients] = useState<PatientSession[]>(MOCK_PATIENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState('1')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setDoctorEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) {
          setDoctorName(profile.full_name)
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

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0]

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bed.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg text-dark font-sans flex flex-col">
      {/* Topbar */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
            <span className="block text-[9px] text-muted tracking-wider uppercase font-semibold">Doctor Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <div className="h-8 w-8 bg-accent/20 rounded-full flex items-center justify-center text-dark font-bold text-xs uppercase">
              {doctorName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold uppercase">{doctorName}</span>
              <span className="block text-[9px] text-muted tracking-wider lowercase">{doctorEmail}</span>
            </div>
          </div>
          <button
            id="doctor-signout-btn"
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
        
        {/* Left Column: Patient List (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-lg font-bold tracking-wider uppercase flex items-center gap-2">
                  <ClipboardList size={18} className="text-dark" />
                  Active Dialysis Sessions
                </h1>
                <p className="text-xs text-muted">Monitor telemetry data for patients currently connected to dialysis nodes.</p>
              </div>
              
              {/* Search */}
              <div className="relative flex items-center max-w-xs w-full">
                <Search className="absolute left-3 text-muted" size={14} />
                <input
                  type="text"
                  placeholder="Filter by name or bed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg pl-9 pr-4 py-2 text-xs outline-none focus:border-dark focus:bg-surface transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold tracking-wider uppercase text-muted">
                    <th className="pb-3">Patient & Location</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Vitals (BP / SpO2)</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`group hover:bg-bg/40 transition-colors ${selectedPatientId === patient.id ? 'bg-bg/60' : ''}`}
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-dark/5 rounded-xl flex items-center justify-center text-dark">
                            <User size={16} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold">{patient.name}</span>
                            <span className="block text-[9px] text-muted">{patient.bed}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase ${
                          patient.status === 'active' ? 'bg-success/10 text-success' :
                          patient.status === 'scheduled' ? 'bg-info/10 text-info' :
                          'bg-muted/10 text-muted'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            patient.status === 'active' ? 'bg-success' :
                            patient.status === 'scheduled' ? 'bg-info' : 'bg-muted'
                          }`} />
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {patient.status === 'active' ? (
                          <div className="text-xs font-semibold">
                            <span>{patient.systolic}/{patient.diastolic} mmHg</span>
                            <span className="text-muted text-[10px] ml-2">SpO₂: {patient.spo2}%</span>
                          </div>
                        ) : (
                          <span className="text-muted text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedPatientId(patient.id)}
                          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:border-dark transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Vitals Telemetry Panel */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Stethoscope size={16} className="text-dark" />
                Vitals Telemetry
              </h2>
              <span className="text-[10px] text-muted tracking-wider uppercase font-semibold">Selected: {selectedPatient.name}</span>
            </div>

            {selectedPatient.alert && (
              <div className="bg-warning/10 border border-warning/30 p-3 rounded-xl flex items-start gap-2 text-warning">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold uppercase">System Alert</span>
                  <p className="text-[10px] font-medium leading-normal">{selectedPatient.alert}</p>
                </div>
              </div>
            )}

            {selectedPatient.status === 'active' ? (
              <div className="space-y-4">
                
                {/* Blood Pressure Card */}
                <div className="bg-bg/50 border border-border p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Blood Pressure</span>
                    <span className="text-lg font-bold">{selectedPatient.systolic}/{selectedPatient.diastolic}</span>
                    <span className="text-[10px] text-muted ml-1">mmHg</span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 bg-success/15 text-success rounded text-[9px] font-bold uppercase">Normal</span>
                </div>

                {/* Oxygen Saturation Card */}
                <div className="bg-bg/50 border border-border p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">O₂ Saturation (SpO₂)</span>
                    <span className="text-lg font-bold">{selectedPatient.spo2}%</span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 bg-success/15 text-success rounded text-[9px] font-bold uppercase">Stable</span>
                </div>

                {/* Pump Telemetry */}
                <div className="border-t border-border pt-4 space-y-3">
                  <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Pump Diagnostics</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bg/40 p-3 rounded-xl border border-border/80">
                      <span className="block text-[9px] text-muted font-bold uppercase tracking-wider">Blood Flow</span>
                      <span className="text-sm font-bold">{selectedPatient.bloodFlow}</span>
                      <span className="text-[9px] text-muted ml-1">mL/min</span>
                    </div>
                    <div className="bg-bg/40 p-3 rounded-xl border border-border/80">
                      <span className="block text-[9px] text-muted font-bold uppercase tracking-wider">Dialysate Flow</span>
                      <span className="text-sm font-bold">{selectedPatient.dialysateFlow}</span>
                      <span className="text-[9px] text-muted ml-1">mL/min</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : selectedPatient.status === 'scheduled' ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-10 w-10 bg-info/10 text-info rounded-full flex items-center justify-center mx-auto">
                  <Activity size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Session Scheduled</h3>
                <p className="text-[10px] text-muted px-4">This patient is scheduled for hemodialysis. Session telemetry will populate once treatment is initiated.</p>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="h-10 w-10 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Session Completed</h3>
                <p className="text-[10px] text-muted px-4">The treatment session has concluded successfully. Summary reports are available in records.</p>
              </div>
            )}

            <button
              id="clinical-prescription-btn"
              className="w-full rounded-xl bg-dark text-white py-3 text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-black/90"
            >
              Update Prescription Plan
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-[10px] text-muted flex flex-wrap justify-between gap-2 uppercase tracking-wider max-w-7xl mx-auto w-full">
        <span>HemoSync Clinical Portal v2.4</span>
        <span>Secure Session ID: {selectedPatientId}</span>
      </footer>
    </div>
  )
}
