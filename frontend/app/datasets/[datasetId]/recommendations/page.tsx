"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingCart, 
  Check, 
  X, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Building,
  History,
  Search,
  Filter,
  SlidersHorizontal,
  Bot
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, Skeleton } from "@/components/ui/EmptyState";

export default function ReplenishmentRecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params?.datasetId as string;

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [overrideQuantity, setOverrideQuantity] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>("");
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [itemToOverride, setItemToOverride] = useState<any>(null);

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

  const handleDecision = async (
    recId: string,
    action: "APPROVE" | "REJECT",
    qty?: number,
    reason?: string
  ) => {
    try {
      await api.decideRecommendation(datasetId, recId, action, qty, reason);
      setActionSuccess(`Recorded ${action} decision successfully.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadData();
      if (selectedProduct && selectedProduct.id === recId) {
        setSelectedProduct(null);
      }
      setIsOverrideModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to record decision");
    }
  };

  const openOverrideDialog = (item: any) => {
    setItemToOverride(item);
    setOverrideQuantity(item.recommended_order || 0);
    setOverrideReason(`Adjusted by store manager for ${item.product_name}`);
    setIsOverrideModalOpen(true);
  };

  const filtered = recommendations.filter((r) => {
    const matchesPriority = filterPriority === "ALL" || r.priority_level === filterPriority;
    const matchesSearch =
      (r.product_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.supplier_name || "").toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const criticalCount = recommendations.filter((r) => r.priority_level === "CRITICAL").length;
  const highCount = recommendations.filter((r) => r.priority_level === "HIGH").length;
  const totalRecommendedUnits = recommendations.reduce(
    (sum, r) => sum + (r.recommended_order || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Purchase Orders & Replenishment"
        description="Deterministic reorder queue ranked by stockout probability, lead-time velocity, and supplier constraints."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Orders & Reorders" },
        ]}
        actions={
          <>
            <Link href="/actions">
              <Button
                variant="secondary"
                leftIcon={<History className="h-4 w-4 text-slate-500" />}
              >
                Audit Log
              </Button>
            </Link>
            <Link href="/copilot">
              <Button
                variant="secondary"
                leftIcon={<Bot className="h-4 w-4 text-blue-600" />}
              >
                Ask Copilot
              </Button>
            </Link>
          </>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between border-red-200 bg-red-50/20">
          <div>
            <div className="text-[11px] font-semibold text-red-700 uppercase tracking-wider">
              Critical Depletion
            </div>
            <div className="text-2xl font-bold text-red-900 mt-0.5">
              {criticalCount} SKUs
            </div>
          </div>
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-amber-200 bg-amber-50/20">
          <div>
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              High Urgency
            </div>
            <div className="text-2xl font-bold text-amber-950 mt-0.5">
              {highCount} SKUs
            </div>
          </div>
          <TrendingUp className="h-6 w-6 text-amber-600" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-slate-200">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Recommended Units
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {totalRecommendedUnits.toLocaleString()} units
            </div>
          </div>
          <ShoppingCart className="h-6 w-6 text-blue-600" />
        </Card>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess} Saved to immutable audit log.</span>
        </div>
      )}

      {/* Filters and Priority Tabs */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by product name, SKU, or supplier..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Priority Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterPriority(lvl)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterPriority === lvl
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      {loading ? (
        <Card className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10 text-slate-400" />}
          title="No Replenishment Orders Found"
          description="There are currently no purchase order recommendations matching your active filter criteria."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFilterPriority("ALL");
                setSearch("");
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4 text-right">On-Hand</th>
                  <th className="py-3 px-4 text-right">24h Forecast</th>
                  <th className="py-3 px-4 text-right">Pipeline</th>
                  <th className="py-3 px-4 text-right text-blue-700 font-bold">Recommended</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Mathematical Rationale</th>
                  <th className="py-3 px-4 text-center">Status / Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => {
                  const isCrit = item.priority_level === "CRITICAL";
                  const isHigh = item.priority_level === "HIGH";
                  const isApproved = item.status === "APPROVED";
                  const isRejected = item.status === "REJECTED";

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isCrit ? "bg-red-50/20" : ""
                      }`}
                      onClick={() => setSelectedProduct(item)}
                    >
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={isCrit ? "critical" : isHigh ? "high" : "neutral"}
                        >
                          #{item.priority_rank} {item.priority_level}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.product_name}</div>
                        <div className="font-mono text-slate-400 text-[11px]">
                          {item.sku} &bull; {item.category || "General"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-medium">
                        {item.current_stock?.toFixed(0)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {item.predicted_demand?.toFixed(1)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        {item.incoming_stock || 0}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-blue-700">
                        {item.recommended_order?.toFixed(0)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{item.supplier_name || "Primary Vendor"}</div>
                        <div className="text-[10px] text-slate-400">{item.lead_time_days || 2}d lead time</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={item.reason}>
                        {item.reason}
                      </td>

                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {isApproved ? (
                          <Badge variant="success">Approved</Badge>
                        ) : isRejected ? (
                          <Badge variant="critical">Rejected</Badge>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleDecision(item.id, "APPROVE", item.recommended_order)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openOverrideDialog(item)}
                              title="Modify quantity"
                            >
                              <SlidersHorizontal className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDecision(item.id, "REJECT", 0)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} recommendations</span>
            <span>Deterministic replenishment formula: Lead-Time Demand + Safety Stock - On-Hand - Pipeline</span>
          </div>
        </Card>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Order Recommendation: ${selectedProduct.product_name}`}
          description={`SKU: ${selectedProduct.sku} • Store: ${selectedProduct.store_code || "Active Facility"}`}
          footer={
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleDecision(selectedProduct.id, "REJECT", 0);
                  setSelectedProduct(null);
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleDecision(selectedProduct.id, "APPROVE", selectedProduct.recommended_order);
                  setSelectedProduct(null);
                }}
              >
                Approve {selectedProduct.recommended_order?.toFixed(0)} Units
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-500">Physical Stock</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {selectedProduct.current_stock?.toFixed(0)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-500">Daily Forecast</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {selectedProduct.predicted_demand?.toFixed(1)}
                </div>
              </div>
              <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-200">
                <div className="text-[10px] uppercase font-semibold text-blue-700">Recommended Order</div>
                <div className="text-xl font-bold text-blue-700 mt-1">
                  {selectedProduct.recommended_order?.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Explainable Decision Breakdown
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedProduct.reason}</p>
              <div className="font-mono text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Calculation: Lead-Time Demand ({selectedProduct.lead_time_demand || 0}) + Safety Stock ({selectedProduct.safety_stock || 0}) - On-Hand ({selectedProduct.current_stock || 0}) - Incoming Pipeline ({selectedProduct.incoming_stock || 0})
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Quantity Override Modal */}
      {isOverrideModalOpen && itemToOverride && (
        <Modal
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          title={`Modify Order Quantity: ${itemToOverride.product_name}`}
          description={`Recommended by AI: ${itemToOverride.recommended_order?.toFixed(0)} units`}
          footer={
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setIsOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  handleDecision(
                    itemToOverride.id,
                    "APPROVE",
                    overrideQuantity,
                    overrideReason
                  )
                }
              >
                Confirm {overrideQuantity} Units
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approved Order Units
              </label>
              <input
                type="number"
                min="0"
                value={overrideQuantity}
                onChange={(e) => setOverrideQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason / Operator Audit Note
              </label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for manual adjustment..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
