"use client";

import { Droplets, Activity } from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";

import Progress from "@/visualizations/Progress";

import { useMonitor } from "@/providers/MonitorProvider";

interface Staff {
  id: string;
  initials: string;
}

interface SessionData {
  total_fluid_removed: number;
  target_fluid: number;

  ktv: number;
  ktv_target: number;

  assigned_staff: Staff[];
}

interface MonitorData {
  session: SessionData;
}

function StaffAvatar({
  initials,
  dark = false,
}: {
  initials: string;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold",
        dark
          ? "bg-neutral-900 text-white"
          : "bg-neutral-300 text-white",
      ].join(" ")}
    >
      {initials}
    </div>
  );
}

export default function SessionWidget() {
  const { data } = useMonitor();

  const session = (data as MonitorData | null)?.session;

  if (!session) {
    return (
      <Widget
        title="Session Analytics"
        subtitle="Live Treatment Progress"
        icon={<Droplets size={18} />}
      >
        <WidgetBody layout="fill">
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Waiting for session data...
          </div>
        </WidgetBody>
      </Widget>
    );
  }

  return (
    <Widget
      title="Session Analytics"
      subtitle="Live Treatment Progress"
      icon={<Droplets size={18} />}
    >
      <WidgetBody>
        <div className="space-y-8">

          {/* Progress Section */}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            <Progress
              title="Fluid Removed"
              value={session.total_fluid_removed}
              max={session.target_fluid}
              unit="L"
              targetLabel={`Target ${session.target_fluid.toFixed(2)} L`}
              color="default"
            />

            <Progress
              title="Kt/V"
              value={session.ktv}
              max={session.ktv_target}
              targetLabel={`Target ${session.ktv_target.toFixed(2)}`}
              color="success"
            />

          </div>

          {/* Staff */}

          <div className="border-t border-border pt-5">

            <p className="mb-4 text-xs uppercase tracking-widest text-muted">
              Assigned Staff
            </p>

            <div className="flex items-center gap-3">

              {session.assigned_staff.map((staff, index) => (
                <StaffAvatar
                  key={staff.id}
                  initials={staff.initials}
                  dark={index === 0}
                />
              ))}

            </div>

          </div>

        </div>
      </WidgetBody>
    </Widget>
  );
}