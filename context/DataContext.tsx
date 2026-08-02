"use client";

import { createContext, useContext } from "react";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface Datasource<T = any> {
  status: ConnectionStatus;
  data?: T;
  lastUpdated?: string;
  error?: string;
}

export type DataStore = Record<string, Datasource>;

export interface DataContextType {
  store: DataStore;
  connection: ConnectionStatus;
}

export const DataContext = createContext<DataContextType>({
  store: {},
  connection: "disconnected",
});

export function useDataContext() {
  return useContext(DataContext);
}