"use client";

import { cn } from "@/lib/utils";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface TableProps<T extends Record<string, any>> {
  columns: TableColumn[];

  rows: T[];

  compact?: boolean;

  striped?: boolean;

  className?: string;

  emptyMessage?: string;
}

export default function Table<T extends Record<string, any>>({
  columns,
  rows,

  compact = false,

  striped = true,

  emptyMessage = "No records available",

  className,
}: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        className="
          flex
          h-48
          items-center
          justify-center

          rounded-2xl

          border
          border-dashed
          border-border

          text-sm
          text-muted
        "
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-auto rounded-2xl border border-border",
        className
      )}
    >
      <table className="min-w-full border-collapse">
        {/* Header */}

        <thead className="sticky top-0 bg-neutral-50 backdrop-blur">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "border-b border-border",

                  compact ? "px-3 py-2" : "px-4 py-3",

                  "text-xs",

                  "uppercase",

                  "tracking-wider",

                  "font-semibold",

                  "text-muted",

                  column.align === "center" &&
                    "text-center",

                  column.align === "right" &&
                    "text-right",

                  (!column.align ||
                    column.align === "left") &&
                    "text-left"
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={cn(
                "transition-colors",

                "hover:bg-neutral-50",

                striped &&
                  index % 2 === 1 &&
                  "bg-neutral-50/40"
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    compact
                      ? "px-3 py-2"
                      : "px-4 py-3",

                    "border-b border-border",

                    "text-sm",

                    column.align === "center" &&
                      "text-center",

                    column.align === "right" &&
                      "text-right",

                    (!column.align ||
                      column.align === "left") &&
                      "text-left"
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}