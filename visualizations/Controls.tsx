"use client";

import { cn } from "@/lib/utils";

export interface ControlField {
  id: string;

  label: string;

  type: "number" | "select" | "switch";

  value: any;

  unit?: string;

  options?: string[];
}

interface ControlsProps {
  fields: ControlField[];

  onChange: (id: string, value: any) => void;

  className?: string;
}

export default function Controls({
  fields,
  onChange,
  className,
}: ControlsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",

        "grid-cols-1",

        "sm:grid-cols-2",

        className
      )}
    >
      {fields.map((field) => (
        <div
          key={field.id}
          className="
            rounded-2xl
            border
            border-border
            bg-neutral-50
            p-4
          "
        >
          <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-2">
            {field.label}
          </label>

          {/* NUMBER */}

          {field.type === "number" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={field.value}
                onChange={(e) =>
                  onChange(field.id, Number(e.target.value))
                }
                className="
                  flex-1

                  rounded-xl

                  border

                  border-border

                  bg-white

                  px-3

                  py-2

                  text-lg

                  font-mono

                  outline-none

                  focus:ring-2

                  focus:ring-black
                "
              />

              {field.unit && (
                <span className="text-sm text-muted">
                  {field.unit}
                </span>
              )}
            </div>
          )}

          {/* SELECT */}

          {field.type === "select" && (
            <select
              value={field.value}
              onChange={(e) =>
                onChange(field.id, e.target.value)
              }
              className="
                w-full

                rounded-xl

                border

                border-border

                bg-white

                px-3

                py-2
              "
            >
              {field.options?.map((option) => (
                <option key={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {/* SWITCH */}

          {field.type === "switch" && (
            <button
              onClick={() =>
                onChange(field.id, !field.value)
              }
              className={cn(
                "relative",

                "h-8",

                "w-14",

                "rounded-full",

                "transition-all",

                field.value
                  ? "bg-black"
                  : "bg-neutral-300"
              )}
            >
              <span
                className={cn(
                  "absolute",

                  "top-1",

                  "h-6",

                  "w-6",

                  "rounded-full",

                  "bg-white",

                  "transition-all",

                  field.value
                    ? "left-7"
                    : "left-1"
                )}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}