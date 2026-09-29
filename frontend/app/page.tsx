"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  UploadCloud, 
  Cpu, 
  TrendingUp, 
  ShoppingCart, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  BarChart3,
  Database
} from "lucide-react";
import { ThreeVisual } from "@/components/ui/ThreeVisual";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ThreeUI Visual */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ThreeVisual variant="neural" height={700} />
      </div>

      {/* Top Navigation */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 font-bold text-lg text-white tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            DS
          </div>
          <span>DarkStore<span className="text-blue-400">.AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition"
          >
            Launch Platform
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 flex flex-col items-center text-center justify-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Generation Inventory Decision Engine
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Automate Replenishment & Eliminate Stockouts for Quick-Commerce
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          DarkStore.AI integrates DuckDB OLAP processing, LightGBM demand forecasts, and Poisson replenishment equations to give dark store operators exact purchase order recommendations.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
          >
            <span>Enter Decision Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#workflow"
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            View Analytical Architecture
          </a>
        </div>

        {/* 5-Step Workflow Display */}
        <section id="workflow" className="mt-20 w-full text-left">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Deterministic Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              The 5-Step Decision Intelligence Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold text-blue-400 uppercase">Step 1</div>
                <div className="font-semibold text-white text-sm mt-0.5">Ingest</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  DuckDB ingests any raw CSV or Parquet files from your ERP.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Cpu className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold text-purple-400 uppercase">Step 2</div>
                <div className="font-semibold text-white text-sm mt-0.5">Canonical Match</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Heuristic & semantic mapper unifies arbitrary headers to canonical dark store schema.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold text-cyan-400 uppercase">Step 3</div>
                <div className="font-semibold text-white text-sm mt-0.5">ML Forecast</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  LightGBM forecasts 24h/48h/7d velocity while Isolation Forest detects phantom stock.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-400 uppercase">Step 4</div>
                <div className="font-semibold text-white text-sm mt-0.5">Recommend</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Deterministic replenishment equations compute exact reorder quantities.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold text-rose-400 uppercase">Step 5</div>
                <div className="font-semibold text-white text-sm mt-0.5">Human Governance</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Store operators approve, override, or reject purchase orders with complete audit logging.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-5 px-6 text-center text-xs text-slate-500 relative z-10">
        DarkStore.AI &bull; Enterprise Decision Intelligence for Quick-Commerce
      </footer>
    </div>
  );
}
