"use client";

import {
  Activity,
  Droplets,
  Thermometer,
  HeartPulse,
} from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";

import Metric from "@/visualizations/Metric";

import { useMonitor } from "@/providers/MonitorProvider";

interface VitalsData {
  heart_rate: number;
  spo2: number;
  temperature: number;
  map: number;
}

interface MonitorData {
  vitals: VitalsData;
}

export default function VitalsWidget() {
  const { data } = useMonitor();

  const vitals = (data as MonitorData | null)?.vitals;

  if (!vitals) {
    return (
      <Widget
        title="Patient Vitals"
        subtitle="Live Measurements"
        icon={<HeartPulse size={18} />}
      >
        <WidgetBody layout="fill">
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Waiting for vitals...
          </div>
        </WidgetBody>
      </Widget>
    );
  }

  return (
    <Widget
      title="Patient Vitals"
      subtitle="Live Measurements"
      icon={<HeartPulse size={18} />}
    >
      <WidgetBody>
        <div className="grid grid-cols-2 gap-6">
          <Metric
            title="Heart Rate"
            value={vitals.heart_rate}
            unit="BPM"
            icon={<HeartPulse size={18} />}
            color="critical"
          />

          <Metric
            title="SpO₂"
            value={vitals.spo2}
            unit="%"
            icon={<Droplets size={18} />}
            color="success"
          />

          <Metric
            title="Temperature"
            value={vitals.temperature}
            unit="°C"
            icon={<Thermometer size={18} />}
          />

          <Metric
            title="MAP"
            value={vitals.map}
            unit="mmHg"
            icon={<Activity size={18} />}
          />
        </div>
      </WidgetBody>
    </Widget>
  );
}