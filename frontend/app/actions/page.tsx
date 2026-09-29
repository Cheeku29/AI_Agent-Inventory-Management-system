"use client";

import React, { useState, useEffect } from "react";
import { History, ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, Calendar, UserCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function ActionHistoryPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dsId = localStorage.getItem("active_dataset_id");
    if (dsId) {
      setActiveDatasetId(dsId);
      api.getActionHistory(dsId)
        .then((items) => {
          setHistory(items || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
          <History className="h-4 w-4" />
          Audit & Governance Log
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Action History
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Immutable audit record of operator approvals, rejections, and quantity overrides.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading audit history...</div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          <History className="h-10 w-10 text-gray-500 mx-auto mb-3" />
          <div className="text-base font-semibold text-white">No Decisions Recorded Yet</div>
          <p className="text-xs text-gray-400 mt-1">
            When you approve or reject replenishment orders in "What Should I Order?", they will appear here.
          </p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden border border-gray-800 rounded-xl shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/90 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Action</th>
                <th className="py-3.5 px-4 font-semibold">Product & SKU</th>
                <th className="py-3.5 px-4 font-semibold text-right">Recommended</th>
                <th className="py-3.5 px-4 font-semibold text-right">Approved Qty</th>
                <th className="py-3.5 px-4 font-semibold">Operator / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {history.map((h) => {
                const isApproved = h.action === "APPROVE";
                return (
                  <tr key={h.id} className="hover:bg-gray-800/30 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {h.timestamp ? new Date(h.timestamp).toLocaleString() : "Just now"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          isApproved
                            ? "bg-emerald-950/80 border border-emerald-700 text-emerald-300"
                            : "bg-red-950/80 border border-red-700 text-red-300"
                        }`}
                      >
                        {isApproved ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {h.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{h.product_name || h.sku}</div>
                      <div className="font-mono text-xs text-gray-400">{h.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-400">
                      {h.original_quantity || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {h.approved_quantity || 0}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      <div className="text-gray-300 font-medium">{h.performed_by || "Human Operator"}</div>
                      <div className="text-gray-400 truncate max-w-xs">{h.reason}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
