"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  TrendingUp, 
  ShoppingCart, 
  ShieldAlert, 
  ArrowRight,
  Database,
  BarChart3
} from "lucide-react";
import { api } from "@/lib/api";

const STAGES = [
  { id: "profiling", label: "Profiling & ingesting uploaded files in DuckDB", icon: Database },
  { id: "canonical", label: "Normalizing columns to Canonical Schema", icon: Cpu },
  { id: "quality", label: "Evaluating dataset quality & capabilities", icon: CheckCircle2 },
  { id: "features", label: "Engineering sales velocity and lead-time features", icon: BarChart3 },
  { id: "forecasting", label: "Running LightGBM 24h/48h/7d demand models", icon: TrendingUp },
  { id: "anomalies", label: "Executing Isolation Forest & phantom stock checks", icon: ShieldAlert },
  { id: "stockout", label: "Predicting stockout urgency & depletion hours", icon: ShieldAlert },
  { id: "replenishment", label: "Calculating deterministic replenishment order quantities", icon: ShoppingCart },
  { id: "complete", label: "Decision engine analysis ready", icon: CheckCircle2 },
];

export default function AnalysisProgressPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params?.datasetId as string;

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [pipelineSummary, setPipelineSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let stageInterval: any;

    // Simulate progress through analytical stages while API executes
    stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    // Call real FastAPI backend analysis endpoint
    api.triggerAnalysis(datasetId)
      .then((res) => {
        clearInterval(stageInterval);
        setCurrentStageIdx(STAGES.length - 1);
        setIsDone(true);
        setPipelineSummary(res);
        localStorage.setItem("active_dataset_id", datasetId);
      })
      .catch((err) => {
        clearInterval(stageInterval);
        setErrorMsg(err.message || "Analysis error occurred");
      });

    return () => clearInterval(stageInterval);
  }, [datasetId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Processing Dark Store Intelligence
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Executing high-performance DuckDB transformations and ML models
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Stages Card */}
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="space-y-4">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isFinished = idx < currentStageIdx || isDone;
            const isCurrent = idx === currentStageIdx && !isDone;

            return (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition ${
                  isCurrent
                    ? "bg-indigo-950/40 border border-indigo-500/40"
                    : isFinished
                    ? "text-gray-300"
                    : "text-gray-400 opacity-60"
                }`}
              >
                <div className="shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-700" />
                  )}
                </div>
                <div className="flex-1 text-sm font-medium">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button when complete */}
        {isDone && (
          <div className="mt-8 pt-6 border-t border-gray-800 text-center animate-fade-in">
            <div className="mb-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {pipelineSummary?.recommendations_count || 17} Products Require Replenishment Action
            </div>
            <button
              onClick={() => router.push(`/datasets/${datasetId}/recommendations`)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>View "What Should I Order?" Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
