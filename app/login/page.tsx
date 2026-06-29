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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (data?.user) {
        // Retrieve profile role to redirect immediately
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        let finalRole = profile?.role

        if (profileError || !profile) {
          console.warn('Could not read profile role from DB on login, using metadata fallback:', profileError)
          
          // Try user metadata role, then fallback to 'user'
          finalRole = data.user.user_metadata?.role || 'user'
          
          const newProfile = {
            id: data.user.id,
            email: data.user.email!,
            role: finalRole,
            full_name: data.user.user_metadata?.full_name || '',
          }

          // Use upsert to avoid primary key duplicate errors if the record already exists
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert(newProfile)

          if (upsertError) {
            console.error('Client-side profile upsert error on login:', upsertError)
          }
        }

        router.replace(`/${finalRole}`)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
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
        {/* Top header styling */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
            <Activity size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
            <span className="block text-[10px] text-muted tracking-wider uppercase font-medium">Clinical Portal</span>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-xs text-muted mb-6">Please authenticate using your clinical credentials.</p>

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

        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="doctor@hemosync.com"
                className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider uppercase text-muted" htmlFor="password-input">
              Access Code / Password
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

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
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

        <div className="mt-6 border-t border-border pt-4 text-center space-y-2">
          <p className="text-xs text-muted">
            New to the system?{' '}
            <Link id="signup-link" href="/signup" className="font-semibold text-dark hover:underline">
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
