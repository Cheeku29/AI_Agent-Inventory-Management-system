"use client";

import React from "react";
import Link from "next/link";
import { 
  Boxes, 
  ArrowRight, 
  UploadCloud, 
  Cpu, 
  TrendingUp, 
  ShoppingCart, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-xl text-white">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <span>DarkStore<span className="text-indigo-400">.AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Quick-Commerce Decision Intelligence
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Turn Inventory Data Into <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Smarter Decisions</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
          Upload your inventory data and let AI identify stockout risks, overstock,
          anomalies and the exact products you should replenish.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#workflow"
            className="px-7 py-3.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 font-semibold transition"
          >
            See How It Works
          </a>
        </div>

        {/* 5-Step Workflow Display (Section 4 & 2 of prompt.txt) */}
        <section id="workflow" className="mt-24 w-full">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-8">
            The Decision Intelligence Workflow
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            {/* Step 1 */}
            <div className="glass-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-indigo-400 mb-1">Step 1</div>
                <div className="font-bold text-white text-base">Upload</div>
                <p className="text-xs text-gray-400 mt-2">
                  Bring any CSV, Excel, or Parquet file from your ERP or WMS.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-purple-400 mb-1">Step 2</div>
                <div className="font-bold text-white text-base">Analyze</div>
                <p className="text-xs text-gray-400 mt-2">
                  Universal profiler infers schema, checks quality, and verifies fields.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-cyan-400 mb-1">Step 3</div>
                <div className="font-bold text-white text-base">Predict</div>
                <p className="text-xs text-gray-400 mt-2">
                  LightGBM & Isolation Forest forecast demand and isolate anomalies.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-emerald-400 mb-1">Step 4</div>
                <div className="font-bold text-white text-base">Recommend</div>
                <p className="text-xs text-gray-400 mt-2">
                  Deterministic replenishment engine calculates exact order quantities.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-rose-400 mb-1">Step 5</div>
                <div className="font-bold text-white text-base">Act</div>
                <p className="text-xs text-gray-400 mt-2">
                  Human manager approves or modifies purchase orders with full audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-6 px-6 text-center text-xs text-gray-400">
        AI Inventory Decision Engine &bull; Built with Supabase, DuckDB, LightGBM & Google Gemini
      </footer>
    </div>
  );
}
