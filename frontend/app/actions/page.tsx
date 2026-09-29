"use client";

import React, { useState, useEffect } from "react";
import { History, ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, Calendar, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/EmptyState";

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
    <div className="space-y-6">
      <PageHeader
        title="Audit & Governance Log"
        description="Immutable enterprise audit record of human manager purchase approvals, order rejections, and quantity overrides."
        badge={
          <Badge variant="neutral" size="md">
            {history.length} Actions Logged
          </Badge>
        }
      />

      {loading ? (
        <Card className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      ) : history.length === 0 ? (
        <EmptyState
          icon={<History className="h-10 w-10 text-slate-400" />}
          title="No Decisions Recorded Yet"
          description="When you approve or reject replenishment orders in the Order Queue, decisions will automatically be logged here with timestamps."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4 text-right">AI Recommended</th>
                  <th className="py-3 px-4 text-right">Approved Quantity</th>
                  <th className="py-3 px-4">Operator / Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {history.map((h) => {
                  const isApproved = h.action === "APPROVE";
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {h.timestamp ? new Date(h.timestamp).toLocaleString() : "Just now"}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={isApproved ? "success" : "critical"}>
                          {isApproved ? "Approved" : "Rejected"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{h.product_name || h.sku}</div>
                        <div className="font-mono text-[11px] text-slate-400">{h.sku}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {h.original_quantity || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {h.approved_quantity || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{h.performed_by || "Human Operator"}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{h.reason}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
