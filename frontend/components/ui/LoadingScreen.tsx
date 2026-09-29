"use client";

import React, { useEffect, useState, useRef } from "react";
import { getGSAP, isReducedMotion } from "@/lib/gsap";
import { Sparkles, Cpu, Boxes } from "lucide-react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show once per session to respect performance and user time
    if (typeof window === "undefined") return;
    const hasSeen = sessionStorage.getItem("ds_intro_seen");
    if (hasSeen || isReducedMotion()) {
      return;
    }

    setVisible(true);
    const { gsap } = getGSAP();

    // Fast progress ticker (under 950ms)
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 12;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);

        // Smooth GSAP fade out
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.inOut",
            onComplete: () => {
              setVisible(false);
              sessionStorage.setItem("ds_intro_seen", "true");
            },
          });
        }
      } else {
        setProgress(p);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0a0f1d] flex flex-col items-center justify-center select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Brand Icon and Nodes */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-2xl shadow-blue-500/25">
          <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
            <Boxes className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Orbiting particles */}
        <div className="absolute -inset-3 rounded-full border border-blue-500/20 border-dashed animate-spin" style={{ animationDuration: "10s" }} />
      </div>

      {/* Brand Title */}
      <div className="text-center space-y-1 z-10">
        <div className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>DarkStore</span>
          <span className="text-blue-400">.AI</span>
        </div>
        <div className="text-xs text-slate-400 tracking-wider font-medium uppercase">
          Autonomous Inventory Decision Engine
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="w-64 mt-8 space-y-2 z-10">
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            {progress < 40
              ? "Initializing DuckDB OLAP..."
              : progress < 80
              ? "Calibrating LightGBM Ensembles..."
              : "Ready"}
          </span>
          <span className="text-slate-300 font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
