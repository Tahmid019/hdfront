import { getWsUrl } from "@/lib/api";
import { logger } from "@/lib/logger";

export interface WSMessage<T = unknown> {
  source: string;
  data: T;
}

type MessageHandler = (message: WSMessage) => void;
type StatusHandler = (isReceivingData: boolean) => void;

export class MonitorWS {
  private ws: WebSocket | null = null;
  private reconnect = true;
  private lastMessageAt = 0;
  private watchdog: ReturnType<typeof setInterval> | null = null;
  private isReceivingData = false;

  private readonly STALE_THRESHOLD = 5000;

  constructor(
    private onMessage: MessageHandler,
    private onStatusChange?: StatusHandler
  ) {}

  async connect() {
    try {
      const wsUrl = await getWsUrl();
      logger.log("Creating WebSocket connection...");

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        logger.log("✅ WebSocket Connected");
        this.startWatchdog();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.lastMessageAt = Date.now();
          if (!this.isReceivingData) {
            this.isReceivingData = true;
            this.onStatusChange?.(true);
          }
          logger.log("📩 WS Message:", message);
          this.onMessage(message);
        } catch (err) {
          logger.error("Invalid WebSocket message:", err);
        }
      };

      this.ws.onerror = (event) => {
        logger.error("❌ WebSocket Error:", event);
      };

      this.ws.onclose = (event) => {
        logger.warn("🔌 WebSocket Closed:", event.code, event.reason);
        this.stopWatchdog();
        this.setReceiving(false);

        if (this.reconnect) {
          logger.log("Reconnecting in 2 seconds...");
          setTimeout(() => this.connect(), 2000);
        }
      };
    } catch (err) {
      logger.error("Failed to resolve WebSocket URL/Session:", err);
      if (this.reconnect) {
        setTimeout(() => this.connect(), 2000);
      }
    }
  }

  private startWatchdog() {
    this.lastMessageAt = Date.now();
    this.watchdog = setInterval(() => {
      const silentFor = Date.now() - this.lastMessageAt;
      if (silentFor > this.STALE_THRESHOLD && this.isReceivingData) {
        logger.warn(`⚠️ No WS data for ${silentFor}ms`);
        this.setReceiving(false);
      }
    }, 1000);
  }

  private stopWatchdog() {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }
  }

  private setReceiving(value: boolean) {
    if (this.isReceivingData !== value) {
      this.isReceivingData = value;
      this.onStatusChange?.(value);
    }
  }

  disconnect() {
    this.reconnect = false;
    this.stopWatchdog();
    this.ws?.close();
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      logger.warn("WebSocket is not connected.");
    }
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get receivingData() {
    return this.isReceivingData;
  }

  get lastMessageTimestamp() {
    return this.lastMessageAt;
  }
}