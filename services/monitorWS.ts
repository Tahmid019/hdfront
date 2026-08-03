import { getWsUrl } from "@/lib/api";

export interface WSMessage<T = unknown> {
  source: string;
  data: T;
}

type MessageHandler = (message: WSMessage) => void;

export class MonitorWS {
  private ws: WebSocket | null = null;
  private reconnect = true;

  constructor(private onMessage: MessageHandler) {}

  async connect() {
    try {
      // Dynamically fetch URL with fresh JWT query token
      const wsUrl = await getWsUrl();
      console.log("Creating WebSocket connection...");

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ WebSocket Connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          console.log("📩 WS Message:", message);
          this.onMessage(message);
        } catch (err) {
          console.error("Invalid WebSocket message:", err);
        }
      };

      this.ws.onerror = (event) => {
        console.error("❌ WebSocket Error:", event);
      };

      this.ws.onclose = (event) => {
        console.warn("🔌 WebSocket Closed:", event.code, event.reason);

        if (this.reconnect) {
          console.log("Reconnecting in 2 seconds...");
          setTimeout(() => this.connect(), 2000);
        }
      };
    } catch (err) {
      console.error("Failed to resolve WebSocket URL/Session:", err);
      if (this.reconnect) {
        setTimeout(() => this.connect(), 2000);
      }
    }
  }

  disconnect() {
    this.reconnect = false;
    this.ws?.close();
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected.");
    }
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}