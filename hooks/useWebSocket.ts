import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

export function useDjangoWebSocket(path: string, onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const wsUrl = `${WS_BASE_URL}${path}?token=${session.access_token}`;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      };

      ws.onerror = (error) => console.error("WebSocket Error:", error);
      
      socketRef.current = ws;
    };

    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [path]);

  const sendMessage = (data: Record<string, any>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return { sendMessage };
}