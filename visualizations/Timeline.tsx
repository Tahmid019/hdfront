"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Info,
  ShieldAlert,
} from "lucide-react";

export type TimelineType =
  | "info"
  | "success"
  | "warning"
  | "critical";

export interface TimelineItem {
  id: string;

  time: string;

  title: string;

  description?: string;

  type?: TimelineType;
}

interface TimelineProps {
  items: TimelineItem[];

  compact?: boolean;

  className?: string;
}

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

const colorMap = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
  },

  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
  },

  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
  },

  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
  },
};

export default function Timeline({
  items,

  compact = false,

  className,
}: TimelineProps) {
  return (
    <div
      className={cn(
        "flex flex-col",

        "divide-y divide-border",

        className
      )}
    >
      {items.map((item) => {
        const type = item.type ?? "info";

        const Icon = iconMap[type];

        return (
          <div
            key={item.id}
            className={cn(
              "group",

              "flex gap-4",

              compact ? "py-3" : "py-4"
            )}
          >
            {/* Timeline */}

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center",

                  "rounded-full border",

                  colorMap[type].bg,

                  colorMap[type].border
                )}
              >
                <Icon
                  size={18}
                  className={colorMap[type].icon}
                />
              </div>

              <div className="mt-2 flex-1 w-px bg-border" />
            </div>

            {/* Content */}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold">
                  {item.title}
                </h4>

                <div className="flex items-center gap-1 shrink-0 text-xs text-muted">
                  <Clock3 size={12} />
                  {item.time}
                </div>
              </div>

              {item.description && (
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}