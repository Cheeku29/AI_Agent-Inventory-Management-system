"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Database, 
  Plus, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu
} from "lucide-react";
import { api } from "@/lib/api";

export default function DatasetsListPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDatasets()
      .then((data) => {
        setDatasets(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <Database className="h-4 w-4" />
            Dataset Management
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Data Sources & Capabilities
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your dark store datasets, file schemas, quality reports, and active AI models.
          </p>
        </div>

        <Link
          href="/datasets/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span>New Dataset</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading datasets...</div>
      ) : datasets.length === 0 ? (
        <div className="glass-panel p-16 text-center text-gray-400 space-y-4">
          <Database className="h-12 w-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Datasets Connected</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Upload CSV/Parquet data to initialize your dark store's AI replenishment decision engine.
          </p>
          <Link
            href="/datasets/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
          >
            Create Your First Dataset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datasets.map((ds) => (
            <div
              key={ds.id}
              className="glass-card p-6 rounded-2xl border border-gray-800 space-y-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{ds.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{ds.description || "Quick-commerce dark store"}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      ds.status === "analyzed"
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60"
                        : "bg-indigo-950/80 text-indigo-300 border border-indigo-700/60"
                    }`}
                  >
                    {ds.status}
                  </span>
                </div>

                {/* Score & File metrics */}
                <div className="grid grid-cols-3 gap-3 my-5 text-center">
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Quality Score</div>
                    <div className="text-lg font-black text-white mt-1">
                      {ds.quality_score ? `${ds.quality_score}/100` : "--"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Files</div>
                    <div className="text-lg font-black text-white mt-1">
                      {ds.files?.length || 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Rows</div>
                    <div className="text-lg font-black text-white mt-1">
                      {Object.values(ds.row_counts || {}).reduce((a: any, b: any) => a + Number(b), 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Capabilities pills */}
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-2">Detected Capabilities:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(ds.capabilities || ["Inventory Analysis", "Demand Forecasting", "Replenishment"]).map(
                      (c: string, ci: number) => (
                        <span
                          key={ci}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>{c.replace(/_/g, " ")}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <Link
                  href={`/datasets/${ds.id}/upload`}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Upload More Files
                </Link>
                <button
                  onClick={() => {
                    localStorage.setItem("active_dataset_id", ds.id);
                    window.dispatchEvent(new Event("datasetChanged"));
                    window.location.href = `/datasets/${ds.id}/recommendations`;
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  <span>Select & Open Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
