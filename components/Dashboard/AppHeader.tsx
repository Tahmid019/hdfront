"use client";

import {
  Bell,
  Search,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";

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

  connected?: boolean;

  onNotifications?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;

  onLogout?: () => void;
}

export default function AppHeader({
  user,
  connected = true,
  onNotifications,
  onSearch,
  onSettings,
  onLogout,
}: AppHeaderProps) {
  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-700 bg-[#1c1c1c] px-8 text-white">
        {/* Left */}
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-black tracking-wide">
            <span className="text-green-300">Hemo</span>
            <span>dialysis</span>
          </h1>

          <div className="hidden items-center gap-3 md:flex">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                connected ? "bg-lime-400" : "bg-red-500"
              }`}
            />

            <span className="text-2xl font-light text-gray-300">
              {user.name}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <button
            onClick={onNotifications}
            className="transition hover:text-green-400"
          >
            <Bell size={22} strokeWidth={1.8} />
          </button>

          <button
            onClick={onSearch}
            className="transition hover:text-green-400"
          >
            <Search size={22} strokeWidth={1.8} />
          </button>

          <button
            onClick={onSettings}
            className="transition hover:text-green-400"
          >
            <Settings size={22} strokeWidth={1.8} />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
            >
            <LogOut size={16} />
                Logout
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="flex h-9 items-center gap-3 border-b bg-[#ece8e4] px-8 text-sm text-gray-600">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />

        <span>
          {connected
            ? "Live stream connected"
            : "Live stream disconnected"}
        </span>
      </div>
    </>
  );
}