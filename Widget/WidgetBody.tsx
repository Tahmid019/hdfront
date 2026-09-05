"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface WidgetBodyProps {
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  layout?: "default" | "center" | "fill" | "scroll";
}

export default function WidgetBody({
  children,
  className,
  loading = false,
  empty = false,
  emptyMessage = "No data available",
  layout = "default",
}: WidgetBodyProps) {
  return (
    <div
      className={cn(
        "relative flex-1 min-h-0 w-full p-5 transition-all",
        {
          "flex items-center justify-center": layout === "center",
          "flex flex-col": layout === "default",
          flex: layout === "fill",
          "overflow-y-auto": layout === "scroll",
        },
        className
      )}
    >
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 rounded bg-neutral-200" />
          <div className="h-40 rounded-2xl bg-neutral-200" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 rounded-xl bg-neutral-200" />
            <div className="h-12 rounded-xl bg-neutral-200" />
            <div className="h-12 rounded-xl bg-neutral-200" />
          </div>
        </div>
      )}

      {!loading && empty && (
        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50 px-6 text-center text-sm text-muted">
          {emptyMessage}
        </div>
      )}

      {!loading && !empty && (
        <div
          className={cn(
            "h-full w-full",
            layout === "fill" && "flex-1",
            layout === "default" && "space-y-4"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}