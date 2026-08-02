export type WidgetStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "error";

export type WidgetSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

export type WidgetType =
  | "waveform"
  | "metric"
  | "progress"
  | "timeline"
  | "gauge"
  | "controls"
  | "table";

export interface WidgetConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: WidgetType;
  size?: WidgetSize;
  datasource?: string;
  refreshInterval?: number;
  configurable?: boolean;
  visible?: boolean;
}

export interface Datasource<T = any> {
  status: WidgetStatus;
  data?: T;
  lastUpdated?: string;
  error?: string;
}