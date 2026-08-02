// app/dashboard/layout.tsx

"use client";

import { ReactNode } from "react";
import AppHeader from "@/components/Dashboard/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

    // temporary
  const user = {
    name: "Tahmid Choudhury",
    email: "tahmid@gmail.com",
    role: "technician" as const,
  };

  const handleLogout = () => {
    console.log("Logout");
    // Later:
    // remove JWT
    // router.push("/login")
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        onLogout={handleLogout}
      />

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}