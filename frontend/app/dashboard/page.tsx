"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Boxes, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  Bot,
  Activity,
  Layers
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { api } from "@/lib/api";

const RISK_COLORS = ["#ef4444", "#f97316", "#eab308", "#10b981"];

export default function OverviewDashboardPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<any>({ items: [], total_skus: 0, total_inventory_value: 0 });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stockoutRisks, setStockoutRisks] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = (dsId: string) => {
    if (!dsId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      api.getInventory(dsId).catch(() => ({ items: [], total_skus: 0, total_inventory_value: 0 })),
      api.getReplenishment(dsId).catch(() => []),
      api.getStockoutRisks(dsId).catch(() => []),
      api.getAnomalies(dsId).catch(() => [])
    ]).then(([inv, recs, risks, anoms]) => {
      setInventoryData(inv);
      setRecommendations(recs);
      setStockoutRisks(risks);
      setAnomalies(anoms);
      setLoading(false);
    });
  };

  useEffect(() => {
    const dsId = localStorage.getItem("active_dataset_id");
    if (dsId) {
      setActiveDatasetId(dsId);
      loadAll(dsId);
    } else {
      api.getDatasets().then((list) => {
        if (list.length > 0) {
          const firstId = list[0].id;
          setActiveDatasetId(firstId);
          localStorage.setItem("active_dataset_id", firstId);
          loadAll(firstId);
        } else {
          setLoading(false);
        }
      });
    }

    const handleDatasetChanged = () => {
      const updated = localStorage.getItem("active_dataset_id") || "";
      setActiveDatasetId(updated);
      loadAll(updated);
    };

    window.addEventListener("datasetChanged", handleDatasetChanged);
    return () => window.removeEventListener("datasetChanged", handleDatasetChanged);
  }, []);

  const criticalStockouts = stockoutRisks.filter((r) => r.risk_level === "CRITICAL").length;
  const highStockouts = stockoutRisks.filter((r) => r.risk_level === "HIGH").length;

  // Chart data: Top 6 Replenishment Products
  const topReplenishmentData = recommendations
    .filter((r) => r.recommended_order > 0)
    .slice(0, 6)
    .map((r) => ({
      name: r.product_name?.length > 14 ? r.product_name.slice(0, 14) + "..." : r.product_name,
      orderQty: r.recommended_order,
      stock: r.current_stock,
      demand: r.predicted_demand
    }));

  // Risk Distribution Data
  const riskDistData = [
    { name: "Critical", value: criticalStockouts },
    { name: "High", value: highStockouts },
    { name: "Medium", value: stockoutRisks.filter((r) => r.risk_level === "MEDIUM").length },
    { name: "Low", value: stockoutRisks.filter((r) => r.risk_level === "LOW").length },
  ].filter((d) => d.value > 0);

  if (loading) {
    return <div className="text-center py-24 text-gray-400">Loading intelligence dashboard...</div>;
  }

  if (!activeDatasetId) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Boxes className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">No Datasets Connected</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">
          Upload your inventory CSV/Excel files to start AI replenishment intelligence.
        </p>
        <Link
          href="/datasets/new"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
        >
          Create First Dataset
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Inventory Decision Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time quick-commerce dark store health and predictive recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/datasets/${activeDatasetId}/recommendations`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Order Queue ({recommendations.filter((r) => r.recommended_order > 0).length})</span>
          </Link>
          <Link
            href="/copilot"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-indigo-300 font-semibold text-sm border border-gray-700 transition"
          >
            <Bot className="h-4 w-4 text-indigo-400" />
            <span>Ask Copilot</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Section 26 of prompt.txt) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* SKUs */}
        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Total SKUs</span>
            <Boxes className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {inventoryData.total_skus || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {(inventoryData.total_inventory_units || 0).toLocaleString()} physical units
          </div>
        </div>

        {/* Total Value */}
        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Inventory Value</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            ${(inventoryData.total_inventory_value || 0).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">
            Active valuation
          </div>
        </div>

        {/* Critical Stockouts */}
        <div className="glass-card p-5 rounded-xl border border-rose-900/60 bg-rose-950/20">
          <div className="flex items-center justify-between text-xs text-rose-300 uppercase font-semibold">
            <span>Critical Stockouts</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-200 mt-2">
            {criticalStockouts}
          </div>
          <div className="text-xs text-rose-300 mt-1 font-medium">
            Depletion in &lt; 4 hours
          </div>
        </div>

        {/* Anomalies */}
        <div className="glass-card p-5 rounded-xl border border-amber-900/60 bg-amber-950/20">
          <div className="flex items-center justify-between text-xs text-amber-300 uppercase font-semibold">
            <span>Anomalies Flagged</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-200 mt-2">
            {anomalies.length}
          </div>
          <div className="text-xs text-amber-300 mt-1">
            Phantom stock & outliers
          </div>
        </div>
      </div>

      {/* Visual Charts Section (Section 28 of prompt.txt) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Top Replenishments */}
        <div className="lg:col-span-2 glass-panel p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Top Products Requiring Replenishment</h3>
              <p className="text-xs text-gray-400">Order Quantity vs Current On-Hand Stock</p>
            </div>
            <Link
              href={`/datasets/${activeDatasetId}/recommendations`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topReplenishmentData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="orderQty" name="Recommended Order" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" name="Current Stock" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Risk Distribution */}
        <div className="glass-panel p-6 border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Stockout Risk Distribution</h3>
            <p className="text-xs text-gray-400">Urgency level across catalog</p>
          </div>

          <div className="h-52 w-full my-auto flex items-center justify-center">
            {riskDistData.length === 0 ? (
              <div className="text-xs text-gray-500">No risk data recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-300">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>Critical: {criticalStockouts}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <span>High: {highStockouts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Action Highlight Row */}
      <div className="glass-panel p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Priority Action Queue</h3>
          </div>
          <Link
            href={`/datasets/${activeDatasetId}/recommendations`}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Open Full Queue
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((r, i) => (
            <div key={r.id || i} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  r.priority_level === "CRITICAL" ? "bg-rose-950 text-rose-300 border border-rose-700" : "bg-amber-950 text-amber-300"
                }`}>
                  #{i+1} {r.priority_level}
                </span>
                <span className="font-mono text-xs text-gray-400">Stock: {r.current_stock?.toFixed(0)}</span>
              </div>
              <div className="font-bold text-white text-sm">{r.product_name}</div>
              <div className="text-xs text-gray-300 line-clamp-2">{r.reason}</div>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400">Order: {r.recommended_order?.toFixed(0)} units</span>
                <Link
                  href={`/datasets/${activeDatasetId}/recommendations`}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                >
                  Review <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
