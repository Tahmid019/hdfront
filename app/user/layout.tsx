import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  // Retrieve authenticated session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Retrieve profile role to verify RBAC
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'user') {
    redirect('/unauthorized')
  }

  return <>{children}</>
}