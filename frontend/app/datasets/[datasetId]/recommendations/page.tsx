"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Check, 
  X, 
  Info, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  PackageCheck,
  Building,
  History
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReplenishmentRecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params?.datasetId as string;

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [actionSuccess, setActionSuccess] = useState<string>("");

  const loadData = () => {
    api.getReplenishment(datasetId)
      .then((data) => {
        setRecommendations(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [datasetId]);

  const handleDecision = async (recId: string, action: "APPROVE" | "REJECT", defaultQty: number) => {
    try {
      await api.decideRecommendation(datasetId, recId, action, defaultQty);
      setActionSuccess(`Successfully recorded ${action} for recommendation.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadData();
      if (selectedProduct && selectedProduct.id === recId) {
        setSelectedProduct(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to record decision");
    }
  };

  const filtered = recommendations.filter((r) => {
    if (filterPriority === "ALL") return true;
    return r.priority_level === filterPriority;
  });

  const criticalCount = recommendations.filter((r) => r.priority_level === "CRITICAL").length;
  const highCount = recommendations.filter((r) => r.priority_level === "HIGH").length;
  const totalRecommendedUnits = recommendations.reduce((sum, r) => sum + (r.recommended_order || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <ShoppingCart className="h-4 w-4" />
            Core Decision Module
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            What Should I Order?
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Deterministic purchase recommendations ranked by stockout severity and supplier lead times.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 border border-rose-900/60 text-right">
            <div className="text-[11px] font-semibold text-rose-400 uppercase">Critical Depletion</div>
            <div className="text-lg font-black text-rose-200">{criticalCount} SKUs</div>
          </div>
          <div className="glass-panel px-4 py-2 border border-gray-800 text-right">
            <div className="text-[11px] font-semibold text-gray-400 uppercase">Total Units Needed</div>
            <div className="text-lg font-black text-white">{totalRecommendedUnits.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 text-sm text-emerald-200 flex items-center gap-2 animate-fade-in">
          <PackageCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess} Saved to Action History.</span>
        </div>
      )}

      {/* Priority Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilterPriority(lvl)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterPriority === lvl
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Recommendations Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading recommendations...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          No replenishment actions found for the selected filter.
        </div>
      ) : (
        <div className="glass-panel overflow-hidden border border-gray-800 rounded-xl shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/90 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Product & SKU</th>
                <th className="py-3.5 px-4 font-semibold text-right">Current Stock</th>
                <th className="py-3.5 px-4 font-semibold text-right">Forecast (24h)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Incoming</th>
                <th className="py-3.5 px-4 font-semibold text-right text-emerald-400 font-bold">Order Qty</th>
                <th className="py-3.5 px-4 font-semibold">Supplier</th>
                <th className="py-3.5 px-4 font-semibold">Reason</th>
                <th className="py-3.5 px-4 font-semibold text-center">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.map((item) => {
                const isCrit = item.priority_level === "CRITICAL";
                const isHigh = item.priority_level === "HIGH";
                const isApproved = item.status === "APPROVED";
                const isRejected = item.status === "REJECTED";

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-800/40 transition cursor-pointer ${
                      isCrit ? "bg-rose-950/10" : ""
                    }`}
                    onClick={() => setSelectedProduct(item)}
                  >
                    {/* Priority Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                          isCrit
                            ? "bg-rose-950/80 border border-rose-600 text-rose-300"
                            : isHigh
                            ? "bg-amber-950/80 border border-amber-600 text-amber-300"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        #{item.priority_rank} {item.priority_level}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{item.product_name}</div>
                      <div className="font-mono text-xs text-gray-400">{item.sku} &bull; {item.category || "General"}</div>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium">
                      {item.current_stock?.toFixed(0)}
                    </td>

                    {/* Forecast */}
                    <td className="py-3.5 px-4 text-right font-mono text-cyan-300">
                      {item.predicted_demand?.toFixed(0)}
                    </td>

                    {/* Incoming */}
                    <td className="py-3.5 px-4 text-right font-mono text-gray-400">
                      {item.incoming_stock || 0}
                    </td>

                    {/* Order Qty */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-emerald-400">
                      {item.recommended_order?.toFixed(0)}
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      <div>{item.supplier_name || "Primary"}</div>
                      <div className="text-[11px] text-gray-400">{item.lead_time_days || 2}d lead time</div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 text-xs text-gray-300 max-w-xs truncate" title={item.reason}>
                      {item.reason}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {isApproved ? (
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          ✓ Approved
                        </span>
                      ) : isRejected ? (
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                          ✕ Rejected
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDecision(item.id, "APPROVE", item.recommended_order)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                            title="Approve Recommendation"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(item.id, "REJECT", 0)}
                            className="px-2.5 py-1 rounded bg-gray-800 hover:bg-red-950 text-gray-400 hover:text-red-300 font-semibold text-xs border border-gray-700 transition"
                            title="Reject Recommendation"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Detail Modal (Section 29 of prompt.txt) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 border border-gray-700 rounded-2xl shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Detailed Recommendation Breakdown
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedProduct.product_name}
                </h2>
                <div className="font-mono text-xs text-gray-400">
                  SKU: {selectedProduct.sku} &bull; Store: {selectedProduct.store_code}
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[11px] font-semibold text-gray-400 uppercase">On-Hand Stock</div>
                <div className="text-xl font-bold text-white mt-1">
                  {selectedProduct.current_stock?.toFixed(0)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase">Daily Forecast</div>
                <div className="text-xl font-bold text-cyan-300 mt-1">
                  {selectedProduct.predicted_demand?.toFixed(1)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-900 border border-emerald-900/60 bg-emerald-950/20">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase">Recommended Order</div>
                <div className="text-xl font-black text-emerald-300 mt-1">
                  {selectedProduct.recommended_order?.toFixed(0)}
                </div>
              </div>
            </div>

            {/* AI Explanation Card */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-700/50">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase mb-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                AI Explainable Calculation (Deterministic)
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {selectedProduct.reason}
              </p>
              <div className="mt-3 text-xs text-gray-400 border-t border-indigo-900/50 pt-2 font-mono">
                Formula: Lead-Time Demand ({selectedProduct.lead_time_demand || 0}) + Safety Stock ({selectedProduct.safety_stock || 0}) - Current Stock ({selectedProduct.current_stock || 0}) - Pipeline ({selectedProduct.incoming_stock || 0})
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleDecision(selectedProduct.id, "REJECT", 0)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-950 text-red-300 text-sm font-semibold border border-gray-700 transition"
              >
                Reject Order
              </button>
              <button
                onClick={() => handleDecision(selectedProduct.id, "APPROVE", selectedProduct.recommended_order)}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition"
              >
                Approve {selectedProduct.recommended_order?.toFixed(0)} Units
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
