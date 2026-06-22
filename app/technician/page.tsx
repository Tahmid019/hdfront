'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, LogOut, Cpu, AlertCircle, CheckCircle2, Wrench, RefreshCcw, SlidersHorizontal, Settings } from 'lucide-react'

interface MachineNode {
  id: string
  serial: string
  status: 'operational' | 'maintenance' | 'offline'
  temp: number
  conductivity: number
  pressure: number
  lastCalibrated: string
}

const INITIAL_MACHINES: MachineNode[] = [
  { id: '1', serial: 'HD-NODE-001', status: 'operational', temp: 37.0, conductivity: 13.8, pressure: -180, lastCalibrated: '2 hours ago' },
  { id: '2', serial: 'HD-NODE-002', status: 'maintenance', temp: 39.2, conductivity: 14.2, pressure: -210, lastCalibrated: '3 days ago' },
  { id: '3', serial: 'HD-NODE-003', status: 'operational', temp: 36.8, conductivity: 13.7, pressure: -175, lastCalibrated: '1 day ago' },
  { id: '4', serial: 'HD-NODE-004', status: 'offline', temp: 0, conductivity: 0, pressure: 0, lastCalibrated: '1 week ago' },
]

export default function TechnicianDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [techName, setTechName] = useState('Clinical Technician')
  const [techEmail, setTechEmail] = useState('')
  const [machines, setMachines] = useState<MachineNode[]>(INITIAL_MACHINES)
  const [selectedNodeId, setSelectedNodeId] = useState('1')
  const [calibrating, setCalibrating] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Custom calibration parameters
  const [targetTemp, setTargetTemp] = useState(37.0)
  const [targetCond, setTargetCond] = useState(13.8)
  const [targetPres, setTargetPres] = useState(-180)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setTechEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) {
          setTechName(profile.full_name)
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

  const selectedNode = machines.find(m => m.id === selectedNodeId) || machines[0]

  useEffect(() => {
    if (selectedNode) {
      setTargetTemp(selectedNode.temp)
      setTargetCond(selectedNode.conductivity)
      setTargetPres(selectedNode.pressure)
    }
  }, [selectedNodeId])

  const runCalibration = () => {
    setCalibrating(true)
    setTimeout(() => {
      setMachines(prev =>
        prev.map(m =>
          m.id === selectedNodeId
            ? { ...m, temp: targetTemp, conductivity: targetCond, pressure: targetPres, lastCalibrated: 'Just now', status: 'operational' }
            : m
        )
      )
      setCalibrating(false)
    }, 2000)
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
            <span className="block text-[9px] text-muted tracking-wider uppercase font-semibold">Technician Core</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <div className="h-8 w-8 bg-accent/20 rounded-full flex items-center justify-center text-dark font-bold text-xs uppercase">
              {techName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold uppercase">{techName}</span>
              <span className="block text-[9px] text-muted tracking-wider lowercase">{techEmail}</span>
            </div>
          </div>
          <button
            id="tech-signout-btn"
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
        
        {/* Left Column: Machine Nodes list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-lg font-bold tracking-wider uppercase flex items-center gap-2">
                <Cpu size={18} className="text-dark" />
                Hemodialysis Machine Nodes
              </h1>
              <p className="text-xs text-muted font-medium">Verify hardware diagnostics and run safety maintenance sequences.</p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 text-left relative overflow-hidden group ${
                    selectedNodeId === node.id
                      ? 'border-dark bg-bg/40 shadow-md'
                      : 'border-border bg-surface hover:border-muted hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-wider uppercase">{node.serial}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase ${
                      node.status === 'operational' ? 'bg-success/15 text-success' :
                      node.status === 'maintenance' ? 'bg-warning/15 text-warning' :
                      'bg-muted/15 text-muted'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  {node.status !== 'offline' ? (
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-muted font-semibold uppercase tracking-wider">
                      <div>
                        <span className="block text-[8px] text-muted/80">Temp</span>
                        <span className="text-xs font-bold text-dark">{node.temp}°C</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-muted/80">Cond</span>
                        <span className="text-xs font-bold text-dark">{node.conductivity}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-muted/80">Pressure</span>
                        <span className="text-xs font-bold text-dark">{node.pressure}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-muted py-2 uppercase tracking-wide">Node is powered off</div>
                  )}

                  <div className="mt-4 border-t border-border/60 pt-3 flex justify-between items-center text-[9px] text-muted font-medium">
                    <span>Calibrated: {node.lastCalibrated}</span>
                    <span className="text-dark font-bold underline group-hover:no-underline uppercase tracking-wider">Select Node</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calibration Controls */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-dark" />
                Calibration Console
              </h2>
              <span className="text-[10px] text-muted tracking-wider uppercase font-semibold">Active: {selectedNode.serial}</span>
            </div>

            {selectedNode.status === 'offline' ? (
              <div className="text-center py-12 space-y-3">
                <div className="h-10 w-10 bg-muted/10 text-muted rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Node Offline</h3>
                <p className="text-[10px] text-muted px-4">This node is powered off. Diagnostics and calibrations are unavailable until powered on.</p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Temp slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span>Target Temperature</span>
                    <span className="text-xs">{targetTemp.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="42"
                    step="0.1"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                    className="w-full"
                    disabled={calibrating}
                  />
                  <div className="flex justify-between text-[8px] text-muted font-semibold">
                    <span>35.0°C</span>
                    <span>Safety Standard: 37.0°C</span>
                    <span>42.0°C</span>
                  </div>
                </div>

                {/* Conductivity slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span>Dialysate Conductivity</span>
                    <span className="text-xs">{targetCond.toFixed(1)} mS/cm</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="16"
                    step="0.1"
                    value={targetCond}
                    onChange={(e) => setTargetCond(parseFloat(e.target.value))}
                    className="w-full"
                    disabled={calibrating}
                  />
                  <div className="flex justify-between text-[8px] text-muted font-semibold">
                    <span>12.0</span>
                    <span>Safety Standard: 13.8</span>
                    <span>16.0</span>
                  </div>
                </div>

                {/* Pressure Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span>Access Pressure</span>
                    <span className="text-xs">{targetPres} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="-300"
                    max="-50"
                    step="5"
                    value={targetPres}
                    onChange={(e) => setTargetPres(parseInt(e.target.value))}
                    className="w-full"
                    disabled={calibrating}
                  />
                  <div className="flex justify-between text-[8px] text-muted font-semibold">
                    <span>-300 mmHg</span>
                    <span>Standard: -180 mmHg</span>
                    <span>-50 mmHg</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="run-calibration-btn"
                  onClick={runCalibration}
                  disabled={calibrating}
                  className="w-full rounded-xl bg-dark text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-black/90 flex items-center justify-center gap-2"
                >
                  {calibrating ? (
                    <>
                      <RefreshCcw size={14} className="animate-spin" />
                      Executing Safety Routine...
                    </>
                  ) : (
                    <>
                      <Wrench size={14} />
                      Calibrate & Verify Node
                    </>
                  )}
                </button>

              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-[10px] text-muted flex flex-wrap justify-between gap-2 uppercase tracking-wider max-w-7xl mx-auto w-full">
        <span>HemoSync Hardware Console v2.4</span>
        <span>Secure Session ID: {selectedNodeId}</span>
      </footer>
    </div>
  )
}
