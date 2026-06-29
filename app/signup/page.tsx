'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Activity, Mail, Lock, User, Loader2, ArrowRight, Stethoscope, Settings, UserCheck } from 'lucide-react'
import OtpVerification from '@/components/OtpVerification'

type Role = 'doctor' | 'technician' | 'user'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('user')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
          },
        },
      })

      if (signupError) {
        throw signupError
      }

      if (data?.session) {
        // If auto-logged in, redirect immediately to their dashboard
        router.replace(`/${role}`)
        router.refresh()
      } else {
        // Verification email sent, or verification needed
        setShowOtpVerification(true)
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Registration error details:', err)
      let msg = 'An unexpected error occurred during registration.'
      if (err) {
        if (typeof err === 'string') {
          msg = err
        } else if (typeof err.message === 'string') {
          msg = err.message
        } else {
          try {
            msg = err.message ? JSON.stringify(err.message) : JSON.stringify(err)
          } catch {
            msg = String(err)
          }
        }
      }
      setError(msg === '{}' ? 'Database/SMTP server error (Code 500)' : msg)
      setLoading(false)
    }
  }

  if (showOtpVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 font-sans text-dark">
        <OtpVerification
          email={email}
          initialRole={role}
          onBack={() => setShowOtpVerification(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 font-sans text-dark">
      <div className="w-full max-w-md border border-border bg-surface p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden fade-in">
        
        {/* Top header styling */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
            <span className="block text-[10px] text-muted tracking-wider uppercase font-medium">Account Portal</span>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6 fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success mx-auto mb-4 animate-bounce">
              <UserCheck size={32} />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">Registration Complete</h2>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Clinical registration request submitted successfully. Please check your inbox to confirm your email address and authorize your portal credentials.
            </p>
            <Link
              id="goto-login-btn"
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90"
            >
              Go to Sign In
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold tracking-tight mb-2">Create Clinical Account</h1>
            <p className="text-xs text-muted mb-6">Register to access the HemoSync hemodialysis dashboards.</p>

            {error && (
              <div className="mb-4 rounded-xl bg-critical/10 p-3 text-xs font-semibold text-critical animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted" htmlFor="name-input">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-muted" size={16} />
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Jordan Chase"
                    className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted" htmlFor="email-input">
                  Clinical Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-muted" size={16} />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="j.chase@hemosync.com"
                    className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted" htmlFor="password-input">
                  Set Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-muted" size={16} />
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection Segmented Cards */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted">
                  System Portal Access Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all ${
                      role === 'doctor'
                        ? 'border-dark bg-dark text-white shadow-md'
                        : 'border-border bg-bg hover:bg-surface hover:border-muted text-dark'
                    }`}
                    disabled={loading}
                  >
                    <Stethoscope size={18} className="mb-1" />
                    <span className="text-[10px] font-semibold tracking-wide">Doctor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('technician')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all ${
                      role === 'technician'
                        ? 'border-dark bg-dark text-white shadow-md'
                        : 'border-border bg-bg hover:bg-surface hover:border-muted text-dark'
                    }`}
                    disabled={loading}
                  >
                    <Settings size={18} className="mb-1" />
                    <span className="text-[10px] font-semibold tracking-wide">Technician</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all ${
                      role === 'user'
                        ? 'border-dark bg-dark text-white shadow-md'
                        : 'border-border bg-bg hover:bg-surface hover:border-muted text-dark'
                    }`}
                    disabled={loading}
                  >
                    <UserCheck size={18} className="mb-1" />
                    <span className="text-[10px] font-semibold tracking-wide">Patient</span>
                  </button>
                </div>
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering Profile...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-xs text-muted">
                Already have an account?{' '}
                <Link id="login-link" href="/login" className="font-semibold text-dark hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
