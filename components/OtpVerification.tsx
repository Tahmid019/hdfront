'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, Loader2, ArrowRight, ArrowLeft, RefreshCw, KeyRound, Mail } from 'lucide-react'

interface OtpVerificationProps {
  email: string
  onBack: () => void
  initialRole?: string
}

export default function OtpVerification({ email, onBack, initialRole }: OtpVerificationProps) {
  const [activeEmail, setActiveEmail] = useState(email)
  const [emailSent, setEmailSent] = useState(!!email)
  const [otp, setOtp] = useState<string[]>(Array(8).fill(''))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(8).fill(null))
  const router = useRouter()
  const supabase = createClient()

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Handle digit input change
  const handleChange = (index: number, value: string) => {
    // Only accept numeric digits
    if (value !== '' && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Focus next box if value entered
    if (value !== '' && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  // Handle pasted values
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    // Find first 8 digits in pasted text
    const digits = text.replace(/[^0-9]/g, '').slice(0, 8).split('')

    if (digits.length > 0) {
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (i < 8) newOtp[i] = digit
      })
      setOtp(newOtp)
      setError(null)

      // Focus the appropriate input after paste
      const targetIndex = Math.min(digits.length, 7)
      inputRefs.current[targetIndex]?.focus()
    }
  }

  // Handle sending verification code (when email is entered on the screen)
  const handleSendInitialCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeEmail) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: activeEmail,
      })

      if (resendError) {
        throw resendError
      }

      setEmailSent(true)
      setCooldown(60)
      setSuccessMessage('A fresh verification code has been dispatched.')
    } catch (err: any) {
      console.error('Send OTP error:', err)
      setError(err.message || 'Failed to dispatch verification code.')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length < 8) {
      setError('Please enter all 8 digits of the verification code.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: activeEmail,
        token: otpCode,
        type: 'signup',
      })

      if (verifyError) {
        throw verifyError
      }

      if (data?.session?.user) {
        setSuccessMessage('Email verified successfully! Authorizing portal access...')
        
        let finalRole = initialRole

        // Fetch user profile from the database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single()

        if (profileError || !profile) {
          // Fallback: If profile table record doesn't exist (e.g. database trigger didn't execute),
          // manually create it from the client-side session context.
          const determinedRole = initialRole || data.session.user.user_metadata?.role || 'user'
          const newProfile = {
            id: data.session.user.id,
            email: data.session.user.email!,
            role: determinedRole,
            full_name: data.session.user.user_metadata?.full_name || '',
          }
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)
            
          if (insertError) {
            console.error('Client-side profile creation error:', insertError)
          }
          finalRole = determinedRole
        } else {
          finalRole = profile.role
        }

        const redirectPath = `/${finalRole || 'user'}`
        router.replace(redirectPath)
        router.refresh()
      } else {
        throw new Error('Verification completed but no active session was established. Please sign in.')
      }
    } catch (err: any) {
      console.error('OTP verification error:', err)
      setError(err.message || 'Verification failed. Please check the code and try again.')
      setLoading(false)
    }
  }

  // Handle resending OTP code
  const handleResend = async () => {
    if (cooldown > 0 || resending || !activeEmail) return
    
    setResending(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: activeEmail,
      })

      if (resendError) {
        throw resendError
      }

      setSuccessMessage('A fresh 8-digit verification code has been dispatched.')
      setCooldown(60)
      setOtp(Array(8).fill(''))
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 50)
    } catch (err: any) {
      console.error('Resend OTP error:', err)
      setError(err.message || 'Failed to dispatch a new verification code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-md border border-border bg-surface p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden fade-in">
      {/* Top branding */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark text-accent">
          <Activity size={18} className="animate-pulse" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-widest uppercase">HemoSync Pro</span>
          <span className="block text-[10px] text-muted tracking-wider uppercase font-medium">Verification Gateway</span>
        </div>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-dark mb-4">
        <KeyRound size={22} />
      </div>

      <h1 className="text-xl font-bold tracking-tight mb-2 uppercase">Verify Your Email</h1>
      
      {emailSent ? (
        <p className="text-xs text-muted mb-6 leading-relaxed">
          An 8-digit secure authorization code was dispatched to <strong className="text-dark">{activeEmail}</strong>. Enter it below to unlock access.
        </p>
      ) : (
        <p className="text-xs text-muted mb-6 leading-relaxed">
          Confirm registration or login credentials by requesting a secure authorization code.
        </p>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-critical/10 p-3 text-xs font-semibold text-critical border border-critical/15 animate-shake">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl bg-success/10 p-3 text-xs font-semibold text-success border border-success/15 animate-fade-in">
          {successMessage}
        </div>
      )}

      {!emailSent ? (
        <form onSubmit={handleSendInitialCode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider uppercase text-muted" htmlFor="otp-email-input">
              Clinical Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-muted" size={16} />
              <input
                id="otp-email-input"
                type="email"
                required
                value={activeEmail}
                onChange={(e) => setActiveEmail(e.target.value)}
                placeholder="doctor@hemosync.com"
                className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                disabled={loading}
              />
            </div>
          </div>
          <button
            id="otp-send-code-btn"
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3.5 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Dispatching Code...
              </>
            ) : (
              <>
                Send Verification Code
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields Row */}
          <div className="flex justify-between gap-1.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 h-12 text-center text-base font-bold rounded-xl border border-border bg-bg outline-none transition-all focus:border-dark focus:bg-surface focus:ring-1 focus:ring-dark"
                disabled={loading || resending}
                autoFocus={index === 0}
                id={`otp-input-${index}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            id="otp-verify-submit-btn"
            type="submit"
            disabled={loading || resending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3.5 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authorizing Portal...
              </>
            ) : (
              <>
                Verify & Authorize
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Resend Actions & Cooldown */}
      <div className="mt-6 flex flex-col gap-3 text-center border-t border-border pt-4">
        {emailSent && (
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resending || loading}
            className="text-xs font-semibold text-dark hover:underline flex items-center justify-center gap-1.5 disabled:text-muted disabled:no-underline disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
            {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Verification Code'}
          </button>
        )}

        <button
          onClick={onBack}
          disabled={loading || resending}
          className="text-xs text-muted hover:text-dark flex items-center justify-center gap-1.5 transition-colors self-center"
        >
          <ArrowLeft size={12} />
          Back to Portal Options
        </button>
      </div>
    </div>
  )
}
