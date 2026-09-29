"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Boxes, 
  TrendingUp, 
  Check, 
  ChevronRight, 
  ShoppingCart,
  Database,
  ShieldCheck,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { DataNetwork3D } from "@/components/3d/DataNetwork3D";
import { getGSAP, isReducedMotion, useGsapContext } from "@/lib/gsap";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const productRevealRef = useRef<HTMLDivElement>(null);

  // Active step for Section 2 (Intelligence)
  const [activeIntelStep, setActiveIntelStep] = useState(0);

  // Subtle Scroll Progress Indicator
  useEffect(() => {
    const handleScroll = () => {
      if (!progressBarRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      progressBarRef.current.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations and ScrollTriggers
  useGsapContext((ctx) => {
    const { gsap, ScrollTrigger } = getGSAP();

    // 1. Hero Entrance (~1.2s target)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-nav", { y: -15, opacity: 0, duration: 0.6 })
      .from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.4 }, "-=0.3")
      .from(".hero-headline-line", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.2")
      .from(".hero-desc", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".hero-cta", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(heroVisualRef.current, { scale: 0.94, opacity: 0, duration: 0.9 }, "-=0.6");

    // 2. Hero Scroll Parallax
    if (heroRef.current && heroTextRef.current) {
      gsap.to(heroTextRef.current, {
        y: -40,
        opacity: 0.8,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (heroVisualRef.current) {
        gsap.to(heroVisualRef.current, {
          y: -25,
          scale: 0.96,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }

    // 3. Section 3 Product Preview Reveal (Scale and fade into view)
    if (productRevealRef.current) {
      gsap.from(productRevealRef.current, {
        scale: 0.93,
        opacity: 0.3,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: productRevealRef.current,
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
        },
      });
    }

    // 4. Section 4 AI Decision Metrics Reveal
    const decisionMetrics = gsap.utils.toArray<HTMLElement>(".metric-cell");
    if (decisionMetrics.length > 0) {
      gsap.from(decisionMetrics, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#section-decision",
          start: "top 78%",
        },
      });
    }
  }, containerRef);

  // Intel progression data (Section 2)
  const intelFlow = [
    {
      stage: "DATA",
      title: "Raw Event Telemetry",
      desc: "Sub-second ingestion of POS sales, rider pick scans, and ERP receipts directly into DuckDB columnar memory.",
      tag: "Embedded OLAP",
    },
    {
      stage: "PATTERNS",
      title: "Anomaly Isolation",
      desc: "Isolation Forest algorithms detect phantom stock, shrinkages, and shelf divergence before bad data corrupts replenishment.",
      tag: "Zero Ghost SKUs",
    },
    {
      stage: "PREDICTION",
      title: "Multi-Horizon Forecast",
      desc: "LightGBM quantile regressors model 24h, 48h, and 7d demand velocity incorporating localized weather and events.",
      tag: "99.4% Precision",
    },
    {
      stage: "ACTION",
      title: "Poisson Reorder POs",
      desc: "Deterministic replenishment equations compute exact purchase order quantities ready for 1-click dispatch.",
      tag: "Autonomous Dispatch",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans"
    >
      {/* Top Subtle Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[100] bg-transparent pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-0 transition-all duration-75 ease-out"
        />
      </div>

      {/* ============================================================== */}
      {/* NAVIGATION (Light, Crisp, Editorial)                           */}
      {/* ============================================================== */}
      <header className="hero-nav sticky top-0 z-50 backdrop-blur-md bg-[#F7F8FA]/90 border-b border-[#E5E9EF] px-6 py-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#111827] tracking-tight">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white font-black text-[10px] shadow-sm">
              DS
            </div>
            <span>DarkStore<span className="text-blue-600">.AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#5B6472]">
            <a href="#section-intelligence" className="hover:text-[#111827] transition">Intelligence</a>
            <a href="#section-product" className="hover:text-[#111827] transition">Product</a>
            <a href="#section-decision" className="hover:text-[#111827] transition">Decision Engine</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-[#5B6472] hover:text-[#111827] transition px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm transition duration-150 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* SECTION 1 — HERO (Editorial #F7F8FA, 45% Text / 55% 3D)        */}
      {/* ============================================================== */}
      <section
        ref={heroRef}
        className="min-h-[calc(100vh-65px)] flex items-center relative z-10 px-6 max-w-6xl mx-auto w-full py-12"
      >
        {/* Subtle radial ambient glow behind the 3D visual */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Faint technical coordinate dots */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">
          {/* Left Column (45%) */}
          <div ref={heroTextRef} className="lg:col-span-6 space-y-5 text-left">
            <div className="hero-eyebrow inline-flex items-center gap-2 text-blue-600 font-mono text-[11px] font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block animate-ping" />
              <span>AI-POWERED INVENTORY INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#111827] tracking-tight leading-[1.05]">
              <span className="hero-headline-line block">TURN INVENTORY DATA</span>
              <span className="hero-headline-line block text-blue-600">
                INTO BETTER DECISIONS.
              </span>
            </h1>

            <p className="hero-desc text-sm sm:text-base text-[#5B6472] max-w-md leading-relaxed font-normal">
              DarkStore.AI pairs embedded DuckDB processing with LightGBM demand forecasts to eliminate stockouts and overstock traps in quick-commerce dark stores.
            </p>

            <div className="hero-cta pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide shadow-sm transition duration-150 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[#E5E9EF] text-[#111827] hover:text-blue-600 text-xs font-medium tracking-wide shadow-sm transition duration-150 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore the Platform</span>
              </Link>
            </div>
          </div>

          {/* Right Column (55%): Procedural Intelligence Network */}
          <div ref={heroVisualRef} className="lg:col-span-6 relative flex items-center justify-center">
            <DataNetwork3D height={440} />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2 — INTELLIGENCE (#FFFFFF background, white cards)     */}
      {/* ============================================================== */}
      <section
        id="section-intelligence"
        className="w-full bg-white border-y border-[#E5E9EF] relative z-10"
      >
        <div className="py-24 px-6 max-w-5xl mx-auto w-full">
          <div className="space-y-4 mb-12 text-left">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-semibold">
              INTELLIGENCE PIPELINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              From raw telemetry to deterministic replenishment.
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6472] max-w-lg leading-relaxed">
              Continuous background processing transforms scattered warehouse events into verified purchase orders without cloud latency.
            </p>
          </div>

          {/* 4-Stage Editorial Flow: DATA → PATTERNS → PREDICTION → ACTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {intelFlow.map((item, i) => (
              <div
                key={item.stage}
                onClick={() => setActiveIntelStep(i)}
                className={`p-5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  activeIntelStep === i
                    ? "bg-white border-blue-600 shadow-md ring-1 ring-blue-500/20"
                    : "bg-white border-[#E5E9EF] hover:border-slate-300 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="font-bold text-blue-600">{item.stage}</span>
                    <span className="text-[#7A8494] bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">{item.tag}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#111827] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#5B6472] leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E9EF] text-[10px] font-mono text-[#7A8494] flex items-center justify-between">
                  <span>Stage 0{i + 1}</span>
                  {activeIntelStep === i && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3 — PRODUCT (#F2F5F8 background, Real Platform UI)     */}
      {/* ============================================================== */}
      <section
        id="section-product"
        className="w-full bg-[#F2F5F8] border-b border-[#E5E9EF] relative z-10"
      >
        <div className="py-24 px-6 max-w-5xl mx-auto w-full">
          <div className="space-y-3 mb-10 text-left">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-semibold">
              ACTUAL PLATFORM
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Designed for dark store productivity.
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6472] max-w-md">
              No clutter. Instant KPI clarity, stockout risk queues, and 1-click reorder authorizations.
            </p>
          </div>

          {/* Real Product Shell (Reveals and Scales subtly on scroll) */}
          <div
            ref={productRevealRef}
            className="rounded-xl border border-[#E5E9EF] bg-white shadow-xl overflow-hidden text-left"
          >
            {/* Top Window Strip */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-[#E5E9EF] flex items-center justify-between text-xs text-[#7A8494]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                <span className="ml-2 font-mono text-[10px] text-[#5B6472]">darkstore.ai/dashboard</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                BKC-Facility-01 &bull; Live Telemetry
              </span>
            </div>

            {/* Operational View Mockup */}
            <div className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                  <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Catalog Monitored</div>
                  <div className="text-xl font-bold text-[#111827] mt-1 font-mono">14,280 SKUs</div>
                  <div className="text-[10px] text-emerald-600 mt-1 font-medium">100% real-time tracking</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                  <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Stockout Risks (24h)</div>
                  <div className="text-xl font-bold text-rose-600 mt-1 font-mono">3 SKUs at Risk</div>
                  <div className="text-[10px] text-rose-600 mt-1 font-medium">Replenishment queued</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                  <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Model Accuracy</div>
                  <div className="text-xl font-bold text-blue-600 mt-1 font-mono">99.4%</div>
                  <div className="text-[10px] text-blue-600 mt-1 font-medium">LightGBM Quantile V2</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]">3 Purchase Orders Ready for Approval</div>
                    <div className="text-[11px] text-[#5B6472]">Deterministic safety stock quantities computed</div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm transition"
                >
                  Open Live Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4 — AI DECISION (#FFFFFF background, Clear Example)    */}
      {/* ============================================================== */}
      <section
        id="section-decision"
        className="w-full bg-white border-b border-[#E5E9EF] relative z-10"
      >
        <div className="py-24 px-6 max-w-5xl mx-auto w-full">
          <div className="space-y-3 mb-10 text-left">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-semibold">
              TRANSPARENT CALCULATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              How data becomes a decision.
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6472] max-w-md">
              No hallucination. Every recommendation exposes current stock, predicted velocity, and computed reorder quantities.
            </p>
          </div>

          {/* Real Example Card */}
          <div className="bg-white border border-[#E5E9EF] shadow-md rounded-xl p-6 sm:p-7 space-y-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5E9EF] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#7A8494] uppercase tracking-wider">PRODUCT</span>
                <h3 className="text-base font-bold text-[#111827] mt-0.5">Wireless Ergonomic Mouse</h3>
              </div>
              <span className="text-xs font-mono text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100 font-semibold">
                Stockout projected in 4.2h
              </span>
            </div>

            {/* 4 Decision Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="metric-cell p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Current Stock</div>
                <div className="text-xl font-bold text-[#111827] mt-1 font-mono">18</div>
              </div>
              <div className="metric-cell p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Predicted Demand</div>
                <div className="text-xl font-bold text-blue-600 mt-1 font-mono">64</div>
              </div>
              <div className="metric-cell p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Recommendation</div>
                <div className="text-xl font-bold text-emerald-600 mt-1 font-mono">Reorder 50</div>
              </div>
              <div className="metric-cell p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E9EF]">
                <div className="text-[10px] font-mono text-[#7A8494] uppercase font-semibold">Confidence</div>
                <div className="text-xl font-bold text-indigo-600 mt-1 font-mono">94%</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#5B6472] gap-2 border-t border-[#E5E9EF] font-mono">
              <span>Equation: PO = max(0, TargetDemand(64) - OnHand(18) + SafetyStock(4)) = 50</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">1-Click Dispatch Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5 — FINAL CTA (#F0F4FA subtle blue-tinted background)   */}
      {/* ============================================================== */}
      <section className="w-full bg-[#F0F4FA] border-b border-[#E5E9EF] relative z-10">
        <div className="py-24 px-6 max-w-3xl mx-auto w-full text-center">
          <div className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Make your inventory work smarter.
            </h2>

            <p className="text-xs sm:text-sm text-[#5B6472] max-w-sm mx-auto leading-relaxed">
              Connect your store dataset in minutes. Experience instant deterministic demand forecasts with zero setup fees.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide shadow-sm transition duration-150 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[#E5E9EF] text-[#111827] hover:text-blue-600 text-xs font-medium tracking-wide shadow-sm transition duration-150"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FOOTER (#F7F8FA background, Minimal & Professional)            */}
      {/* ============================================================== */}
      <footer className="w-full bg-[#F7F8FA] py-8 px-6 relative z-10 text-xs text-[#5B6472]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#111827]">
            <div className="h-5 w-5 rounded bg-blue-600 flex items-center justify-center text-white font-black text-[9px] shadow-sm">
              DS
            </div>
            <span className="text-xs">DarkStore<span className="text-blue-600">.AI</span></span>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-[#5B6472] font-medium">
            <Link href="/dashboard" className="hover:text-[#111827] transition">Dashboard</Link>
            <Link href="/inventory" className="hover:text-[#111827] transition">Inventory</Link>
            <Link href="/insights" className="hover:text-[#111827] transition">AI Insights</Link>
            <Link href="/login" className="hover:text-[#111827] transition">Sign In</Link>
          </div>

          <div className="text-[11px] text-[#7A8494]">
            &copy; {new Date().getFullYear()} DarkStore.AI Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
