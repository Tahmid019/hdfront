import { createClient } from '@/lib/supabase/client'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('User is not authenticated')
  }

  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  }
}

export async function fetchAuthCheck() {
  const res = await fetch("/api/auth-check", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Auth check failed");
  return res.json();
}


export async function patchSection<T extends Record<string, unknown>>(
  section: string,
  payload: T
) {
  const headers = await getAuthHeaders()
  const r = await fetch(`${BASE}/iot/ingest/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ section, payload }),
  })
  if (!r.ok) throw new Error(`patch ${section} failed`)
  return r.json()
}

export async function patchBulk<T extends Record<string, unknown>>(payload: T) {
  const headers = await getAuthHeaders()
  const r = await fetch(`${BASE}/iot/ingest/bulk/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!r.ok) throw new Error('bulk patch failed')
  return r.json()
}

export async function getWsUrl(): Promise<string> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const baseUrl = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000') + '/ws/monitor/'

  return session?.access_token ? `${baseUrl}?token=${session.access_token}` : baseUrl
}