const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchSnapshot() {
  const r = await fetch(`${BASE}/api/snapshot/`, { cache: 'no-store' })
  if (!r.ok) throw new Error('snapshot fetch failed')
  return r.json()
}

export async function patchSection<T extends Record<string, unknown>>(
  section: string,
  payload: T
) {
  const r = await fetch(`${BASE}/iot/ingest/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, payload }),
  })
  if (!r.ok) throw new Error(`patch ${section} failed`)
  return r.json()
}

export async function patchBulk<T extends Record<string, unknown>>(payload: T) {
  const r = await fetch(`${BASE}/iot/ingest/bulk/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!r.ok) throw new Error('bulk patch failed')
  return r.json()
}

export const WS_URL = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000') + '/ws/monitor/'
