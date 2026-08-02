"use client";

import { Activity, LogOut } from "lucide-react";

export type UserRole =
  | "doctor"
  | "technician"
  | "patient"
  | "admin";

interface AppHeaderProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };

  onLogout?: () => void;
}

export default function AppHeader({
  user,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Activity size={20} />
        </div>

        <div>
          <h1 className="text-sm font-bold tracking-widest uppercase">
            Hemo
          </h1>

          <p className="text-xs text-muted-foreground">
            Hemodialysis Monitoring System
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 border-r pr-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold">
              {user.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {user.role}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}