"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import WidgetToolbar from "./WidgetToolbar";

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
}: WidgetProps) {
  return (
    <section
      onClick={onSelect}
      className={cn(
        "group relative",

        "flex flex-col",

        "rounded-3xl",

        "border",

        "bg-surface",

        "transition-all duration-300",

        "overflow-hidden",

        "min-h-[180px]",

        "hover:shadow-lg",

        "hover:border-neutral-300",

        selected &&
          "ring-2 ring-neutral-900 border-neutral-900 shadow-xl",

        className
      )}
    >
      {/* HEADER */}

      <header className="flex items-start justify-between gap-4 px-5 pt-5">
        <div className="flex min-w-0 gap-3">
          {icon && (
            <div
              className="
              h-10
              w-10
              rounded-xl
              bg-neutral-100
              flex
              items-center
              justify-center
              shrink-0
            "
            >
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <h3
              className="
              truncate
              text-base
              font-semibold
              tracking-tight
            "
            >
              {title}
            </h3>

            {subtitle && (
              <p
                className="
                mt-0.5
                text-xs
                uppercase
                tracking-wider
                text-muted
              "
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {actions}

          {toolbar && <WidgetToolbar />}
        </div>
      </header>

      {/* BODY */}

      <div
        className="
        relative

        flex-1

        px-5

        py-4

        flex

        flex-col

        justify-center
      "
      >
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 rounded bg-neutral-200" />

            <div className="h-28 rounded-xl bg-neutral-200" />

            <div className="h-4 w-1/2 rounded bg-neutral-200" />
          </div>
        ) : error ? (
          <div
            className="
            flex

            h-full

            items-center

            justify-center

            rounded-xl

            border

            border-red-200

            bg-red-50

            text-sm

            text-red-700
          "
          >
            {error}
          </div>
        ) : (
          children
        )}
      </div>

      {/* FOOTER */}

      {footer && (
        <footer
          className="
          border-t

          border-border

          px-5

          py-3

          bg-neutral-50/50
        "
        >
          {footer}
        </footer>
      )}

      {/* SELECT INDICATOR */}

      {selected && (
        <div
          className="
          absolute

          left-0

          top-0

          h-full

          w-1.5

          bg-neutral-900
        "
        />
      )}
    </section>
  );
}