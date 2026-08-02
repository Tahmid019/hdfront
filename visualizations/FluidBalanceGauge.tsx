"use client";

import { cn } from "@/lib/utils";

interface FluidBalanceGaugeProps {
  value: number;
  target: number;

  unit?: string;

  status?: "normal" | "warning" | "critical";

  className?: string;
}

export default function FluidBalanceGauge({
  value,
  target,
  unit = "L",
  status = "normal",
  className,
}: FluidBalanceGaugeProps) {
  const percentage = Math.min(value / target, 1);

  const size = 300;
  const stroke = 22;
  const radius = 105;

  const circumference = Math.PI * radius;

  const dashOffset =
    circumference - circumference * percentage;

  const remaining = Math.max(target - value, 0);

  const color =
    status === "critical"
      ? "#ef4444"
      : status === "warning"
      ? "#f59e0b"
      : "#B6E54C";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="relative h-[300px] w-[300px]">
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full"
        >
          {/* Background */}

          <path
            d="
              M45 220
              A105 105 0 0 1 150 45
              A105 105 0 0 1 255 220
            "
            fill="none"
            stroke="#D9D7CF"
            strokeOpacity=".25"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Progress */}

          <path
            d="
              M45 220
              A105 105 0 0 1 150 45
              A105 105 0 0 1 255 220
            "
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition:
                "stroke-dashoffset .7s ease",
            }}
          />

          {/* Tick Labels */}

          <text
            x="55"
            y="205"
            className="fill-neutral-500 text-xs"
          >
            0
          </text>

          <text
            x="140"
            y="65"
            className="fill-neutral-500 text-xs"
          >
            {(target / 2).toFixed(1)}
          </text>

          <text
            x="235"
            y="205"
            className="fill-neutral-500 text-xs"
          >
            {target}
          </text>
        </svg>

        {/* Center */}

        <div
          className="
            absolute
            inset-0

            flex

            flex-col

            items-center

            justify-center
          "
        >
          <p className="text-sm text-muted">
            Fluid Removed
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="font-mono text-6xl font-bold text-[#B6E54C]">
              {value.toFixed(2)}
            </span>

            <span className="pb-2 text-lg text-muted">
              {unit}
            </span>
          </div>

          <p className="mt-4 text-sm text-muted">
            Target {target.toFixed(2)} {unit}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Remaining {remaining.toFixed(2)} {unit}
          </p>
        </div>
      </div>
    </div>
  );
}