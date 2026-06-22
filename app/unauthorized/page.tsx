import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Access Unauthorized - HemoSync Pro',
  description: 'Security exception: you do not have permission to view this resource.',
}

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12 text-dark font-sans">
      <div className="w-full max-w-md border border-border bg-surface p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group fade-in">
        {/* Decorative corner flash */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-critical/5 rounded-full filter blur-xl group-hover:bg-critical/10 transition-colors" />

        <div className="flex flex-col items-center text-center">
          {/* Animated shield alert container */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-critical/10 text-critical mb-6 animate-pulse">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
            Security Shield Active
          </h1>
          
          <div className="h-[2px] w-12 bg-critical mb-4" />

          <p className="text-sm text-muted mb-6 leading-relaxed">
            Access denied. Your clinical account credentials do not have authorization to view this dashboard area.
          </p>

          <div className="w-full space-y-3">
            <Link
              id="back-home-btn"
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark py-3 px-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:bg-black/90"
            >
              <ArrowLeft size={16} />
              Return to Clinical Portal
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-[10px] text-muted tracking-wider uppercase">
        HemoSync Pro Security Defense Layer • Code 403
      </footer>
    </div>
  )
}
