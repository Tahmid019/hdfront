'use client'
import { useEffect, useRef, useState } from 'react'
import { WS_URL } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

type Handler = (msg: { type: string; data: unknown }) => void

export function useMonitorWS(onMessage: Handler) {
  const wsRef  = useRef<WebSocket | null>(null)
  const cbRef  = useRef(onMessage)
  cbRef.current = onMessage

  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        setToken(session.access_token)
      } else {
        setToken(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (loading || !token) {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      return
    }

    let isCancelled = false
    let socket: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connect = () => {
      if (isCancelled) return

      const url = `${WS_URL}?token=${encodeURIComponent(token)}`
      socket = new WebSocket(url)
      wsRef.current = socket

      socket.onmessage = (e) => {
        if (isCancelled) return
        try {
          cbRef.current(JSON.parse(e.data))
        } catch {}
      }

      socket.onclose = () => {
        if (isCancelled) return
        reconnectTimeout = setTimeout(connect, 2000)
      }
    }

    connect()

    return () => {
      isCancelled = true
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (socket) {
        socket.close()
      }
      wsRef.current = null
    }
  }, [token, loading])
}

