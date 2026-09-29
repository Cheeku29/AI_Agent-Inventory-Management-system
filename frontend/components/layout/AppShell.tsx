"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

import { LoadingScreen } from "@/components/ui/LoadingScreen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Standalone pages (Landing, Login, 404)
  const isStandalone = pathname === "/" || pathname === "/login" || pathname === "/404";

  if (isStandalone) {
    const isDark = pathname === "/login";
    return (
      <>
        <LoadingScreen />
        <main className={`min-h-screen ${isDark ? "bg-slate-900 text-slate-100" : "bg-[#F7F8FA] text-[#111827]"}`}>
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Topbar onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-opacity duration-200">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
