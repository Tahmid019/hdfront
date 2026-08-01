"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ProgressProps {
  title: string;

  value: number;

  max: number;

  unit?: string;

  targetLabel?: string;

  color?: "default" | "success" | "warning" | "critical";

  showPercentage?: boolean;

  showTarget?: boolean;

  size?: "sm" | "md" | "lg";

  className?: string;
}

const colors = {
  default: "bg-neutral-900",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export default function Progress({
  title,

  value,

  max,

  unit = "",

  targetLabel,

  color = "default",

  showPercentage = true,

  showTarget = true,

  size = "md",

  className,
}: ProgressProps) {
  const percent = Math.min((value / max) * 100, 100);

  const completed = value >= max;

  const height = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }[size];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted font-medium">
            {title}
          </p>

          {showTarget && targetLabel && (
            <p className="mt-1 text-xs text-muted">
              {targetLabel}
            </p>
          )}
        </div>

        {completed && (
          <CheckCircle2
            size={18}
            className="text-emerald-500"
          />
        )}
      </div>

      {/* Value */}

      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <span className="font-mono text-4xl font-bold">
            {value.toFixed(2)}
          </span>

          {unit && (
            <span className="pb-1 text-sm text-muted">
              {unit}
            </span>
          )}
        </div>

        {showPercentage && (
          <span className="text-sm font-medium text-muted">
            {Math.round(percent)}%
          </span>
        )}
      </div>

      {/* Progress */}

      <div
        className={cn(
          "overflow-hidden rounded-full bg-neutral-200",

          height
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",

            colors[color]
          )}
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Current
        </span>

        <span>
          Target {max.toFixed(2)} {unit}
        </span>
      </div>
    </div>
  );
}