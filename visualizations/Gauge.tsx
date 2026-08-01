"use client";

import { cn } from "@/lib/utils";

interface GaugeProps {
  title: string;

  value: number;

  min?: number;

  max?: number;

  unit?: string;

  warning?: number;

  critical?: number;

  size?: "sm" | "md" | "lg";

  className?: string;
}

export default function Gauge({
  title,

  value,

  min = 0,

  max = 100,

  unit = "",

  warning = 70,

  critical = 90,

  size = "md",

  className,
}: GaugeProps) {
  const percent = Math.max(
    0,
    Math.min(((value - min) / (max - min)) * 100, 100)
  );

  const color =
    value >= critical
      ? "bg-red-500"
      : value >= warning
      ? "bg-amber-500"
      : "bg-emerald-500";

  const dimensions = {
    sm: "w-32 h-32",
    md: "w-44 h-44",
    lg: "w-56 h-56",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",

        className
      )}
    >
      <div className="mb-4 text-center">
        <p className="text-[11px] uppercase tracking-wider text-muted font-medium">
          {title}
        </p>
      </div>

      <div
        className={cn(
          "relative",

          dimensions[size]
        )}
      >
        {/* Background */}

        <div className="absolute inset-0 rounded-full border-[12px] border-neutral-200" />

        {/* Progress */}

        <div
          className={cn(
            "absolute inset-0 rounded-full border-[12px] border-transparent",
            color
          )}
          style={{
            clipPath:
              "polygon(50% 50%,50% 0%,100% 0%,100% 100%,0% 100%,0% 0%)",
            transform: `rotate(${percent * 3.6}deg)`,
            transition: "transform .6s ease",
          }}
        />

        {/* Inner */}

        <div
          className="
            absolute

            inset-5

            rounded-full

            bg-white

            shadow-inner

            flex

            flex-col

            items-center

            justify-center
          "
        >
          <span className="font-mono text-4xl font-bold">
            {value}
          </span>

          {unit && (
            <span className="text-xs text-muted mt-1">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex w-full justify-between text-xs text-muted">
        <span>{min}</span>

        <span>{max}</span>
      </div>
    </div>
  );
}