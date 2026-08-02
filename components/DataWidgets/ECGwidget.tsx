"use client";

import { HeartPulse } from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";
import Waveform from "@/visualizations/Waveform";

import { useMonitor } from "@/providers/MonitorProvider";

interface ECGData {
  waveform: number[];
  bpm: number;
  spo2: number;
  rr: number;
  bp: {
    sys: number;
    dia: number;
  };
  rhythm: string;
  lead: string;
}

interface MonitorData {
  ecg: ECGData;
}

export default function ECGWidget() {
  const { data } = useMonitor();

  console.log("Monitor:", data);

  const ecg = (data as MonitorData | null)?.ecg;

  if (!ecg) {
    return (
      <Widget
        title="Physiological Stream"
        subtitle="Live ECG Monitoring"
        icon={<HeartPulse size={18} />}
      >
        <WidgetBody layout="fill">
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Waiting for ECG data...
          </div>
        </WidgetBody>
      </Widget>
    );
  }

  const { waveform, bpm, spo2, rr, bp, rhythm, lead } = ecg;

  return (
    <Widget
      title="Physiological Stream"
      subtitle="Live ECG Monitoring"
      icon={<HeartPulse size={18} />}
    >
      <WidgetBody layout="fill">
        <Waveform
          data={waveform}
          value={bpm}
          unit="BPM"
          color="#111"
          height={140}
          metrics={[
            { label: "Lead", value: lead },
            { label: "Rhythm", value: rhythm },
            { label: "SpO₂", value: spo2, unit: "%" },
            { label: "Blood Pressure", value: `${bp.sys}/${bp.dia}` },
            { label: "Respiration", value: rr, unit: "/min" },
          ]}
        />
      </WidgetBody>
    </Widget>
  );
}