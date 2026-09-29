"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Database, Bot, Activity, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHealth()
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings & Status</h1>
        <p className="text-sm text-gray-400 mt-1">Platform connectivity, security state, and AI runtime health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Database */}
        <div className="glass-panel p-5 border border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Supabase PostgreSQL</div>
              <div className="text-xs text-gray-400">Database & RLS Multi-Tenancy</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {health?.services?.database || "Ready"}
          </span>
        </div>

        {/* Gemini */}
        <div className="glass-panel p-5 border border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Google Gemini LLM</div>
              <div className="text-xs text-gray-400">Server-Side AI Copilot</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {health?.services?.gemini || "Configured"}
          </span>
        </div>
      </div>
    </div>
  );
}
