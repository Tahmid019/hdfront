// Backend WebSocket payload

export type UserRole = "patient" | "doctor" | "technician";

export interface ECGPoint {
  x: number;
  y: number;
}

export interface MetricData {
  value: number | string;
  unit?: string;
}

export interface ProgressData {
  value: number;
  max: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
}

export interface GaugeData {
  value: number;
  min: number;
  max: number;
}

export interface TableRow {
  [key: string]: string | number | boolean | null;
}

export interface WidgetPayload {
  id: string;
  type: string;
  data: unknown;
}

export interface DashboardPayload {
  timestamp: string;
  role: UserRole;
  widgets: WidgetPayload[];
}

export interface WSMessage {
  source: string;
  data: DashboardPayload;
}