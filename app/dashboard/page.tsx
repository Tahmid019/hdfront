"use client";

import { useEffect, useState } from "react";
import { MonitorProvider } from "@/providers/MonitorProvider";
import { fetchAuthCheck } from "@/lib/api";

import ECGWidget from "@/components/DataWidgets/ECGwidget";
import RespirationWidget from "@/components/DataWidgets/RespirationWidget";
import VitalsWidget from "@/components/DataWidgets/VitalsWidget";
import SessionWidget from "@/components/DataWidgets/SessionWidget";
import FluidBalanceWidget from "@/components/DataWidgets/FluidBalanceWidget";

type UserRole = "doctor" | "technician" | "patient";

interface WidgetDefinition {
  id: string;
  component: React.ComponentType;
  roles: UserRole[];
  span: string;
}

const widgets: WidgetDefinition[] = [
  { id: "ecg", component: ECGWidget, roles: ["doctor", "technician"], span: "col-span-12 xl:col-span-8" },
  { id: "vitals", component: VitalsWidget, roles: ["doctor", "technician", "patient"], span: "col-span-12 xl:col-span-4" },
  { id: "session", component: SessionWidget, roles: ["doctor", "patient"], span: "col-span-12 lg:col-span-4" },
  { id: "fluid", component: FluidBalanceWidget, roles: ["doctor", "patient"], span: "col-span-12 lg:col-span-4" },
  { id: "respiration", component: RespirationWidget, roles: ["doctor", "technician"], span: "col-span-12 lg:col-span-4" },
];

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthCheck()
      .then((data) => {
        setRole(data.role as UserRole);
      })
      .catch(() => {
        setRole(null); // or redirect to login
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!role) {
    return <div className="p-6">Unauthorized. Please log in.</div>;
  }

  return (
    <MonitorProvider>
      <div className="mx-auto max-w-[1800px] p-6">
        <div className="grid grid-cols-12 gap-6">
          {widgets
            .filter(({ roles }) => roles.includes(role))
            .map(({ id, component: Component, span }) => (
              <div key={id} className={span}>
                <Component />
              </div>
            ))}
        </div>
      </div>
    </MonitorProvider>
  );
}
