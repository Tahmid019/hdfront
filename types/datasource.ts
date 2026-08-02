export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface Datasource<T = any> {
  /**
   * Current connection state
   */
  status: ConnectionStatus;

  /**
   * Latest data received from backend
   */
  data?: T;

  /**
   * ISO timestamp of the last successful update
   */
  lastUpdated?: string;

  /**
   * Optional error message
   */
  error?: string;
}

/**
 * All registered datasources.
 *
 * Example:
 * {
 *    "patient.ecg": {...},
 *    "patient.bp": {...},
 *    "session.events": {...}
 * }
 */
export type DataStore = Record<string, Datasource>;