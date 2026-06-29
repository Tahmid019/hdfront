import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Activity, ArrowRight, ShieldCheck, Cpu, Stethoscope, HeartHandshake } from 'lucide-react'

export const metadata = {
  title: 'HemoSync Pro - Hemodialysis Portal',
  description: 'Clinical-grade secure portal for real-time hemodialysis telemetry, hardware configurations, and patient health charts.',
}

export default async function HomePage() {
  const supabase = createClient()
  
  // Try retrieving authenticated user session on the server
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      redirect(`/${profile.role}`)
    } else {
      // If user session is active but profile is missing (e.g. database reset/stale cookies),
      // sign out the user to clear cookies and reload the page.
      await supabase.auth.signOut()
      redirect('/')
    }
  }

  return (
    <div className="min-h-screen bg-bg text-dark font-sans flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
            <span className="block text-[9px] text-muted tracking-wider uppercase font-semibold">Clinical Infrastructure</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            id="nav-login-btn"
            href="/login"
            className="text-xs font-bold uppercase tracking-wider hover:text-muted transition-colors"
          >
            Sign In
          </Link>
          <Link
            id="nav-signup-btn"
            href="/signup"
            className="rounded-xl bg-dark text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-black/90"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Heading and Description */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold text-dark border border-accent/30 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-dark animate-pulse" />
              Secure Portal Ready
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] uppercase">
              Next-Gen Hemodialysis telemetry
            </h1>
            
            <p className="text-sm md:text-base text-muted leading-relaxed max-w-lg">
              Authorized clinical staff can view live hemodialysis sessions, calibrate blood and dialysate pumps, monitor access pressures, and track patient vitals history in a secure environment.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                id="hero-signin-btn"
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-dark px-6 py-3.5 text-sm font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90"
              >
                Sign In to Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link
                id="hero-signup-btn"
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-bold text-dark hover:bg-bg transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right Column: Portal Features Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Feature 1 */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 bg-accent/20 text-dark rounded-xl flex items-center justify-center mb-4">
                <Stethoscope size={20} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2">Physician Hub</h2>
              <p className="text-xs text-muted leading-relaxed">
                Review active patient sessions, live ECG streaming, physician prescriptions, and historical vitals analytics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 bg-dark/5 text-dark rounded-xl flex items-center justify-center mb-4">
                <Cpu size={20} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2">Technician Core</h2>
              <p className="text-xs text-muted leading-relaxed">
                Run dialysis hardware status checks, calibrate sensor thresholds, and analyze equipment diagnostics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 bg-success/15 text-success rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Role-Based Security Shield</h2>
                  <p className="text-xs text-muted leading-relaxed">
                    Database-level Row-Level Security (RLS) and server-side checks restrict all API and page routes. Unauthorized staff cannot view records, calibrators, or dashboards.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center md:flex md:justify-between md:items-center text-[10px] text-muted uppercase tracking-wider max-w-6xl mx-auto w-full gap-4">
        <span>© 2026 HemoSync Pro Inc. All rights reserved.</span>
        <div className="flex justify-center gap-6 mt-2 md:mt-0">
          <span>Clinical Compliance</span>
          <span>HIPAA Certified</span>
          <span>Security Protocol 2.4</span>
        </div>
      </footer>
    </div>
  )
}
