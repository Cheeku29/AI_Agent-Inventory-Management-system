"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Truck, 
  Search, 
  Boxes, 
  ShoppingCart, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, Skeleton } from "@/components/ui/EmptyState";

interface SupplierSummary {
  id: string;
  name: string;
  skuCount: number;
  skus: any[];
  avgLeadTime: number;
  pendingOrdersCount: number;
  totalCatalogValue: number;
}

export default function SuppliersPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierSummary | null>(null);

  const loadData = (dsId: string) => {
    if (!dsId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    Promise.all([
      api.getInventory(dsId).catch(() => ({ items: [] })),
      api.getReplenishment(dsId).catch(() => [])
    ]).then(([invRes, recsRes]) => {
      const items = invRes?.items || [];
      const recs = Array.isArray(recsRes) ? recsRes : [];

      // Group items by supplier
      const map: Record<string, SupplierSummary> = {};

      items.forEach((item: any) => {
        const supId = item.supplier_id || "SUP-DEFAULT";
        const matchingRec = recs.find((r) => r.sku === item.sku);
        const leadTime = matchingRec?.lead_time_days || item.lead_time_days || 2;
        const supName = matchingRec?.supplier_name || `Supplier ${supId}`;

        if (!map[supId]) {
          map[supId] = {
            id: supId,
            name: supName,
            skuCount: 0,
            skus: [],
            avgLeadTime: leadTime,
            pendingOrdersCount: 0,
            totalCatalogValue: 0,
          };
        }

        map[supId].skuCount += 1;
        map[supId].skus.push(item);
        map[supId].totalCatalogValue +=
          Number(item.current_inventory || 0) * Number(item.unit_price || 0);

        if (matchingRec && matchingRec.recommended_order > 0) {
          map[supId].pendingOrdersCount += 1;
        }
      });

      setSuppliers(Object.values(map));
      setLoading(false);
    }).catch(() => {
      setSuppliers([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    const dsId = localStorage.getItem("active_dataset_id") || "";
    setActiveDatasetId(dsId);
    loadData(dsId);

    const handleDatasetChange = () => {
      const updated = localStorage.getItem("active_dataset_id") || "";
      setActiveDatasetId(updated);
      loadData(updated);
    };

    window.addEventListener("datasetChanged", handleDatasetChange);
    return () => window.removeEventListener("datasetChanged", handleDatasetChange);
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Directory"
        description="Fulfillment performance, lead times, SKU coverage, and active replenishment orders across primary vendors."
        badge={
          <Badge variant="neutral" size="md">
            {suppliers.length} Vendors Active
          </Badge>
        }
      />

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers by name or ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Supplier Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-10 w-10 text-slate-400" />}
          title="No Suppliers Found"
          description={
            search
              ? "No vendors match your search keyword."
              : "No supplier records found in the current store dataset."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((s) => (
            <Card
              key={s.id}
              className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => setSelectedSupplier(s)}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{s.name}</h4>
                      <span className="font-mono text-xs text-slate-400">{s.id}</span>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center my-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Catalog SKUs</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{s.skuCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Lead Time</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{s.avgLeadTime}d</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Reorders</div>
                    <div className="font-bold text-blue-600 text-sm mt-0.5">{s.pendingOrdersCount}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Value: ${s.totalCatalogValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  View SKUs <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Supplier Products Detail Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          title={`Supplier Detail: ${selectedSupplier.name}`}
          description={`ID: ${selectedSupplier.id} • ${selectedSupplier.skuCount} products supplied`}
          maxWidth="xl"
          footer={
            <Button variant="primary" onClick={() => setSelectedSupplier(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Standard Lead Time</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{selectedSupplier.avgLeadTime} Days</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Active POs Needed</div>
                <div className="text-xl font-bold text-blue-600 mt-1">{selectedSupplier.pendingOrdersCount}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Catalog Valuation</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ${selectedSupplier.totalCatalogValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                Supplied Products Catalog
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                {selectedSupplier.skus.map((skuItem, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{skuItem.product_name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{skuItem.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium text-slate-700">Stock: {skuItem.current_inventory}</div>
                      <div className="text-[10px] text-slate-400">${Number(skuItem.unit_price || 0).toFixed(2)}/unit</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
