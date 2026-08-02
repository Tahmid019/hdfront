"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { MonitorWS } from "@/services/monitorWS";

interface MonitorContextType {
  data: unknown;
}

const MonitorContext = createContext<MonitorContextType>({
  data: null,
});

export function MonitorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const socket = new MonitorWS(({ data }) => {
      console.log("WS:", data);
      setData(data);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MonitorContext.Provider value={{ data }}>
      {children}
    </MonitorContext.Provider>
  );
}

export const useMonitor = () => useContext(MonitorContext);