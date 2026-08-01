"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

type Trend = "up" | "down" | "neutral";

interface MetricProps {
  title: string;

  value: string | number;

  unit?: string;

  subtitle?: string;

  icon?: ReactNode;

  trend?: Trend;

  trendValue?: string;

  color?: "default" | "success" | "warning" | "critical";

  align?: "left" | "center";

  className?: string;
}

const colorStyles = {
  default: "text-neutral-900",
  success: "text-emerald-600",
  warning: "text-amber-600",
  critical: "text-red-600",
};

export default function Metric({
  title,

  value,

  unit,

  subtitle,

  icon,

  trend,

  trendValue,

  color = "default",

  align = "left",

  className,
}: MetricProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between",

        align === "center" && "items-center text-center",

        className
      )}
    >
      {/* HEADER */}

      <div
        className={cn(
          "flex items-center gap-2",

          align === "center" && "justify-center"
        )}
      >
        {icon && (
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              bg-neutral-100
            "
          >
            {icon}
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted font-medium">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* VALUE */}

      <div className="mt-5">
        <div
          className={cn(
            "flex items-end gap-2",

            align === "center" && "justify-center"
          )}
        >
          <span
            className={cn(
              "font-mono font-bold",

              "text-4xl lg:text-5xl",

              colorStyles[color]
            )}
          >
            {value}
          </span>

          {unit && (
            <span className="pb-2 text-sm text-muted">
              {unit}
            </span>
          )}
        </div>

        {/* Trend */}

        {(trend || trendValue) && (
          <div
            className={cn(
              "mt-4 flex items-center gap-2",

              align === "center" && "justify-center"
            )}
          >
            {trend === "up" && (
              <ArrowUp
                size={16}
                className="text-emerald-600"
              />
            )}

            {trend === "down" && (
              <ArrowDown
                size={16}
                className="text-red-600"
              />
            )}

            {trend === "neutral" && (
              <Minus
                size={16}
                className="text-neutral-500"
              />
            )}

            {trendValue && (
              <span className="text-xs font-medium text-muted">
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}