"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppHeader from "@/components/Dashboard/AppHeader";

interface DashboardUser {
  name: string;
  email: string;
  role: "doctor" | "technician" | "patient";
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (!supabaseUser) {
        router.replace("/login");
        return;
      }

      setUser({
        name: supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        role: supabaseUser.user_metadata?.role || "patient",
      });
    };

    fetchUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) {
    return null; // Or return a loading spinner / skeleton state
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <main className="p-6">{children}</main>
    </div>
  );
}