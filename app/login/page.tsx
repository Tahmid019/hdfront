'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Activity, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import OtpVerification from '@/components/OtpVerification'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.replace('/technician')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  if (showOtpVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 font-sans text-dark">
        <OtpVerification
          email={email}
          onBack={() => setShowOtpVerification(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 font-sans text-dark">
      <div className="w-full max-w-md border border-border bg-surface p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">
              HemoSync Pro
            </span>
            <span className="block text-[10px] text-muted tracking-wider uppercase font-medium">
              Clinical Portal
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-xs text-muted mb-6">
          Please authenticate using your clinical credentials.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl bg-critical/10 p-3 text-xs font-semibold text-critical animate-shake flex flex-col gap-1.5 border border-critical/15">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setShowOtpVerification(true)}
              className="text-left underline hover:text-critical/80 transition-colors mt-1 font-bold"
            >
              Verify your email address or request OTP code →
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="text-[10px] font-bold tracking-wider uppercase text-muted"
            >
              Clinical Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-muted" size={16} />
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hemosync.com"
                disabled={loading}
                className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="text-[10px] font-bold tracking-wider uppercase text-muted"
            >
              Access Code / Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-muted" size={16} />
              <input
                id="password-input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authorizing Session...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 border-t border-border pt-4 text-center space-y-2">
          <p className="text-xs text-muted">
            New to the system?{' '}
            <Link
              id="signup-link"
              href="/signup"
              className="font-semibold text-dark hover:underline"
            >
              Register clinical account
            </Link>
          </p>

          <p className="text-xs text-muted">
            Having trouble signing in?{' '}
            <button
              type="button"
              onClick={() => setShowOtpVerification(true)}
              className="font-semibold text-dark hover:underline"
            >
              Verify account with OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}