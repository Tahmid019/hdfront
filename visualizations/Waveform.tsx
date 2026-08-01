"use client";

import WaveformCanvas from "@/components/WaveformCanvas";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string | number;
  unit?: string;
}

interface WaveformProps {
  data: number[];

  color?: string;

  height?: number;

  label?: string;

  value?: string | number;

  unit?: string;

  metrics?: Metric[];

  className?: string;

  compact?: boolean;
}

function MetricItem({ label, value, unit }: Metric) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
        {label}
      </p>

      <div className="mt-1 flex items-end gap-1">
        <span className="font-mono text-xl font-bold">
          {value}
        </span>

        {unit && (
          <span className="pb-0.5 text-xs text-muted">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Waveform({
  data,

  color = "#111111",

  height = 120,

  label,

  value,

  unit,

  metrics = [],

  compact = false,

  className,
}: WaveformProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col",

        className
      )}
    >
      {/* Wave */}

      <div
        className={cn(
          "rounded-2xl",

          "border border-border",

          "bg-neutral-50",

          compact
            ? "p-3"
            : "p-4"
        )}
      >
        <WaveformCanvas
          data={data}
          color={color}
          height={height}
          label={label}
          value={value}
          unit={unit}
        />
      </div>

      {/* Metrics */}

      {metrics.length > 0 && (
        <div
          className={cn(
            "mt-4",

            "grid gap-4",

            metrics.length <= 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-4"
          )}
        >
          {metrics.map((metric) => (
            <MetricItem
              key={metric.label}
              {...metric}
            />
          ))}
        </div>
      )}
    </div>
  );
}