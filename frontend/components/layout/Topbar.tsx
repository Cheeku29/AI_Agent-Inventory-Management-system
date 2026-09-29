"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Bot, 
  Bell, 
  CheckCircle2, 
  ShieldCheck,
  Command,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = () => {
    const dsId = localStorage.getItem("active_dataset_id") || "";
    setActiveDatasetId(dsId);
    if (dsId) {
      api.getReplenishment(dsId).then((recs) => {
        if (Array.isArray(recs)) {
          const needed = recs.filter((r) => r.recommended_order > 0).length;
          setPendingOrdersCount(needed);
        }
      }).catch(() => {});
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("datasetChanged", loadData);
    return () => window.removeEventListener("datasetChanged", loadData);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs, products, suppliers, or orders..."
            className="w-full pl-9 pr-12 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <kbd className="absolute right-2.5 top-2 text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick actions, Live Engine Status & Orders */}
      <div className="flex items-center gap-3">
        {/* System Health Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Decision Engine Active</span>
        </div>

        {/* Ask Copilot quick link */}
        <Link
          href="/copilot"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <Bot className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Link>

        {/* Pending Orders Button with Badge */}
        <Link
          href={activeDatasetId ? `/datasets/${activeDatasetId}/recommendations` : "/orders"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>Order Queue</span>
          {pendingOrdersCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
