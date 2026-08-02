"use client";

import { Droplets } from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";

import FluidBalanceGauge from "@/visualizations/FluidBalanceGauge";

import { useMonitor } from "@/providers/MonitorProvider";

interface FluidBalance {
  removed: number;
  target: number;
  remaining: number;
  unit: string;
  status: "normal" | "warning" | "critical";
}

interface MonitorData {
  fluid_balance: FluidBalance;
}

export default function FluidBalanceWidget() {
  const { data } = useMonitor();

  const fluid = (data as MonitorData | null)?.fluid_balance;

  return (
    <Widget
      title="Fluid Balance"
      subtitle="Ultrafiltration Progress"
      icon={<Droplets size={18} />}
    >
      <WidgetBody layout="fill">

        {!fluid ? (

          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Waiting for fluid balance...
          </div>

        ) : (

          <FluidBalanceGauge
            value={fluid.removed}
            target={fluid.target}
            unit={fluid.unit}
            status={fluid.status}
          />

        )}

      </WidgetBody>
    </Widget>
  );
}