"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Boxes, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, Skeleton } from "@/components/ui/EmptyState";

export default function InventoryPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const loadData = (dsId: string) => {
    if (!dsId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getInventory(dsId)
      .then((data) => {
        setInventoryItems(data?.items || []);
        setLoading(false);
      })
      .catch(() => {
        setInventoryItems([]);
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

  const categories = Array.from(
    new Set(inventoryItems.map((i) => i.category || "General").filter(Boolean))
  );

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      (item.product_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || (item.category || "General") === categoryFilter;

    let matchesStatus = true;
    const stock = Number(item.current_inventory || 0);
    if (statusFilter === "OUT") matchesStatus = stock <= 0;
    else if (statusFilter === "LOW") matchesStatus = stock > 0 && stock <= 15;
    else if (statusFilter === "NORMAL") matchesStatus = stock > 15;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return <Badge variant="critical">Out of Stock</Badge>;
    }
    if (stock <= 15) {
      return <Badge variant="warning">Low Stock ({stock})</Badge>;
    }
    return <Badge variant="success">In Stock ({stock})</Badge>;
  };

  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;
    const headers = ["Product Name", "SKU", "Category", "Current Stock", "Unit Price", "Supplier"];
    const rows = filteredItems.map((i) => [
      `"${i.product_name || ""}"`,
      `"${i.sku || ""}"`,
      `"${i.category || "General"}"`,
      i.current_inventory || 0,
      i.unit_price || 0,
      `"${i.supplier_id || "Primary"}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Catalog"
        description="Comprehensive view of on-hand inventory levels, unit valuation, categories, and SKU replenishment status."
        badge={
          <Badge variant="neutral" size="md">
            {inventoryItems.length} Total SKUs
          </Badge>
        }
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<Download className="h-4 w-4 text-slate-500" />}
              onClick={handleExportCSV}
              disabled={filteredItems.length === 0}
            >
              Export CSV
            </Button>
            <Link href="/datasets">
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Ingest Data
              </Button>
            </Link>
          </>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or category..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 focus:bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="NORMAL">In Stock (&gt; 15)</option>
              <option value="LOW">Low Stock (&le; 15)</option>
              <option value="OUT">Out of Stock (0)</option>
            </select>

            {(search || categoryFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("ALL");
                  setStatusFilter("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Enterprise Data Table */}
      {loading ? (
        <Card className="p-6 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={<Boxes className="h-10 w-10 text-slate-400" />}
          title="No Inventory Items Found"
          description={
            search || categoryFilter !== "ALL" || statusFilter !== "ALL"
              ? "No items match your selected filters. Try resetting search parameters."
              : "No inventory has been ingested yet for this dark store facility."
          }
          action={
            <Link href="/datasets">
              <Button variant="primary" size="sm">
                Upload Inventory Files
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 font-mono">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Physical Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Valuation</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map((item, idx) => {
                  const stock = Number(item.current_inventory || 0);
                  const price = Number(item.unit_price || 0);
                  const valuation = stock * price;

                  return (
                    <tr
                      key={item.sku || idx}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {item.product_name || "Unnamed Item"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {item.sku}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.category || "General"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                        {stock.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStockBadge(stock)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        ${price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                        ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.supplier_id || "Primary"}
                      </td>
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(item)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredItems.length} of {inventoryItems.length} products</span>
            <span>Sorted by default SKU order</span>
          </div>
        </Card>
      )}

      {/* SKU Product Details Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.product_name}
          description={`SKU: ${selectedProduct.sku} • Category: ${selectedProduct.category || "General"}`}
          footer={
            <Button variant="primary" onClick={() => setSelectedProduct(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">On-Hand Stock</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {selectedProduct.current_inventory || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Unit Price</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ${Number(selectedProduct.unit_price || 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Total Asset Value</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ${(Number(selectedProduct.current_inventory || 0) * Number(selectedProduct.unit_price || 0)).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Supplier Code</div>
                <div className="text-sm font-bold text-slate-700 mt-2 truncate">
                  {selectedProduct.supplier_id || "Primary"}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                AI Replenishment Parameter Inspection
              </div>
              <p className="text-slate-600 leading-relaxed">
                Deterministic replenishment monitors daily sales velocity, supplier delivery lead times, and Poisson safety buffer requirements for this SKU.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
