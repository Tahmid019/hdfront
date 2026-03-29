'use client'
import { useEffect, useRef, useCallback } from 'react'
import { WS_URL } from '@/lib/api'

type Handler = (msg: { type: string; data: unknown }) => void

export function useMonitorWS(onMessage: Handler) {
  const wsRef  = useRef<WebSocket | null>(null)
  const cbRef  = useRef(onMessage)
  cbRef.current = onMessage

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try { cbRef.current(JSON.parse(e.data)) } catch {}
    }
    ws.onclose = () => {
      setTimeout(connect, 2000)
    }
    return ws
  }, [])

  useEffect(() => {
    const ws = connect()
    return () => { ws.close() }
  }, [connect])
}
