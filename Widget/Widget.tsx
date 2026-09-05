"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import WidgetToolbar from "./WidgetToolbar";
import { Connecting, Disconnected, Error } from "@/lib/help";

export interface WidgetProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  toolbar?: boolean;
  selected?: boolean;
  loading?: boolean;
  error?: string;
  footer?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onSelect?: () => void;
  status?: "connected" | "connecting" | "disconnected" | "error";
  datasource?: string;
}

export default function Widget({
  title,
  subtitle,
  icon,
  toolbar = true,
  selected = false,
  loading = false,
  error,
  footer,
  actions,
  children,
  className,
  onSelect,
  status = "connected",
}: WidgetProps) {
  const content = loading ? (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-1/3 rounded-md bg-neutral-200/80" />
      <div className="h-28 rounded-2xl bg-neutral-100" />
      <div className="h-4 w-2/3 rounded-md bg-neutral-200/80" />
    </div>
  ) : error ? (
    <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-red-100 bg-red-50/70 px-4 text-sm font-medium text-red-600">
      {error}
    </div>
  ) : status === "connecting" ? (
    <Connecting />
  ) : status === "disconnected" ? (
    <Disconnected />
  ) : status === "error" ? (
    <Error />
  ) : children;

  return (
    <section
      onClick={onSelect}
      className={cn(
        "group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/40",
        selected && "border-neutral-900 ring-1 ring-neutral-900 shadow-xl shadow-neutral-200/50",
        onSelect && "cursor-pointer",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] bg-transparent transition-colors",
          selected ? "bg-neutral-900" : "group-hover:bg-neutral-200"
        )}
      />

      <header className="flex items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-all duration-300 group-hover:bg-neutral-100",
                selected && "border-neutral-200 bg-neutral-100"
              )}
            >
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {actions}
          {toolbar && <WidgetToolbar />}
        </div>
      </header>

      <div className="mx-5 h-px bg-border/50" />

      <div className="relative flex flex-1 flex-col justify-start px-5 py-5">
        {content}
      </div>

      {footer && (
        <footer className="border-t border-border/60 bg-neutral-50/40 px-5 py-3">
          {footer}
        </footer>
      )}

      {selected && (
        <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-neutral-900" />
      )}
    </section>
  );
}