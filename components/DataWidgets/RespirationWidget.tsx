"use client";

import { Wind } from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";
import Waveform from "@/visualizations/Waveform";

import { useMonitor } from "@/providers/MonitorProvider";

interface RespirationData {
  waveform: number[];
  rr: number;
  pattern: string;
  quality?: string;
}

interface MonitorData {
  respiration: RespirationData;
}

export default function RespirationWidget() {
  const { data } = useMonitor();

  const respiration = (data as MonitorData | null)?.respiration;

  if (!respiration) {
    return (
      <Widget
        title="Respiration"
        subtitle="Respiration Monitoring"
        icon={<Wind size={18} />}
      >
        <WidgetBody layout="fill">
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Waiting for Respiration data...
          </div>
        </WidgetBody>
      </Widget>
    );
  }

  return (
    <Widget
      title="Respiration"
      subtitle="Respiration Monitoring"
      icon={<Wind size={18} />}
    >
      <WidgetBody layout="fill">
        <Waveform
          data={respiration.waveform}
          value={respiration.rr}
          unit="/min"
          color="#5B7FFF"
          height={120}
          metrics={[
            {
              label: "Pattern",
              value: respiration.pattern,
            },
            {
              label: "Quality",
              value: respiration.quality ?? "Good",
            },
          ]}
        />
      </WidgetBody>
    </Widget>
  );
}