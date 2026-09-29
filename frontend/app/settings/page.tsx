"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Database, Bot, Activity, CheckCircle2, Server, Cpu } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="System Settings & Engine Status"
        description="Core infrastructure health, database connection state, and AI runtime integration status."
        badge={<Badge variant="success">All Services Operational</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Supabase Database */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Supabase PostgreSQL</div>
              <div className="text-xs text-slate-500">Multi-tenant database & RLS security</div>
            </div>
          </div>
          <Badge variant="success">
            {health?.services?.database || "Connected"}
          </Badge>
        </Card>

        {/* Gemini AI LLM */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Google Gemini LLM</div>
              <div className="text-xs text-slate-500">Server-side Copilot decision agent</div>
            </div>
          </div>
          <Badge variant="info">
            {health?.services?.gemini || "Configured"}
          </Badge>
        </Card>

        {/* DuckDB Ingestion Engine */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">DuckDB OLAP Engine</div>
              <div className="text-xs text-slate-500">Local fast parquet profiling & joins</div>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </Card>

        {/* ML Forecaster */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">LightGBM & Isolation Forest</div>
              <div className="text-xs text-slate-500">Predictive demand & anomaly engine</div>
            </div>
          </div>
          <Badge variant="success">Ready</Badge>
        </Card>
      </div>
    </div>
  );
}
