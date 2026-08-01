"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type Setting =
  | {
      id: string;
      label: string;
      type: "slider";
      value: number;
      min: number;
      max: number;
      step?: number;
    }
  | {
      id: string;
      label: string;
      type: "switch";
      value: boolean;
    }
  | {
      id: string;
      label: string;
      type: "select";
      value: string;
      options: string[];
    }
  | {
      id: string;
      label: string;
      type: "color";
      value: string;
    }
  | {
      id: string;
      label: string;
      type: "number";
      value: number;
    };

interface Props {
  title?: string;

  settings: Setting[];

  onChange: (id: string, value: any) => void;

  className?: string;
}

export default function WidgetSettings({
  title = "Widget Settings",
  settings,
  onChange,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col",

        "rounded-3xl",

        "border border-border",

        "bg-surface",

        "overflow-hidden",

        className
      )}
    >
      {/* HEADER */}

      <div className="border-b border-border px-6 py-5">
        <h2 className="text-base font-semibold">{title}</h2>

        <p className="mt-1 text-xs uppercase tracking-wider text-muted">
          Customize Visualization
        </p>
      </div>

      {/* BODY */}

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {settings.map((item) => (
          <div key={item.id} className="space-y-2">
            <label className="text-sm font-medium">{item.label}</label>

            {/* Slider */}

            {item.type === "slider" && (
              <>
                <input
                  type="range"
                  value={item.value}
                  min={item.min}
                  max={item.max}
                  step={item.step ?? 1}
                  onChange={(e) =>
                    onChange(item.id, Number(e.target.value))
                  }
                  className="w-full accent-black"
                />

                <div className="text-right text-xs text-muted">
                  {item.value}
                </div>
              </>
            )}

            {/* Switch */}

            {item.type === "switch" && (
              <button
                onClick={() => onChange(item.id, !item.value)}
                className={cn(
                  "relative h-7 w-12 rounded-full transition-all",

                  item.value
                    ? "bg-black"
                    : "bg-neutral-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1",

                    "h-5 w-5 rounded-full bg-white",

                    "transition-all",

                    item.value
                      ? "left-6"
                      : "left-1"
                  )}
                />
              </button>
            )}

            {/* Select */}

            {item.type === "select" && (
              <div className="relative">
                <select
                  value={item.value}
                  onChange={(e) =>
                    onChange(item.id, e.target.value)
                  }
                  className="
                    w-full

                    rounded-xl

                    border

                    border-border

                    bg-white

                    px-3

                    py-2

                    text-sm

                    appearance-none
                  "
                >
                  {item.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-3 text-muted"
                />
              </div>
            )}

            {/* Number */}

            {item.type === "number" && (
              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  onChange(item.id, Number(e.target.value))
                }
                className="
                  w-full

                  rounded-xl

                  border

                  border-border

                  px-3

                  py-2

                  text-sm
                "
              />
            )}

            {/* Color */}

            {item.type === "color" && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={item.value}
                  onChange={(e) =>
                    onChange(item.id, e.target.value)
                  }
                  className="
                    h-10

                    w-10

                    cursor-pointer

                    rounded-lg

                    border
                  "
                />

                <span className="font-mono text-xs text-muted">
                  {item.value}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}