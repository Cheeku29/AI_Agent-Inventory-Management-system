"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Store, Warehouse, Building2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const FACILITY_TYPES = [
  { id: "dark_store", name: "Dark Store", desc: "Quick-commerce 10-20 min fulfillment hubs", icon: Store },
  { id: "warehouse", name: "Warehouse", desc: "Regional central distribution and storage", icon: Warehouse },
  { id: "retail", name: "Retail Store", desc: "Supermarkets and storefront inventory", icon: ShoppingBag },
  { id: "dc", name: "Distribution Center", desc: "Cross-dock logistics and high-velocity transit", icon: Building2 },
];

export default function NewDatasetPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("dark_store");
  const [name, setName] = useState("Downtown Dark Store #04");
  const [description, setDescription] = useState("Quick-commerce dark store operations");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createDataset(name, description);
      localStorage.setItem("active_dataset_id", res.id);
      router.push(`/datasets/${res.id}/upload`);
    } catch (err: any) {
      alert(err.message || "Failed to create dataset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-xs font-semibold text-indigo-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Onboarding
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          What are you managing?
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure your facility profile and initialize an isolated dataset workspace.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8">
        {/* Facility Types Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FACILITY_TYPES.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedType === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedType(f.id)}
                className={`cursor-pointer p-5 rounded-xl border transition ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50"
                    : "bg-gray-900/60 border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-base">{f.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dataset Details */}
        <div className="glass-panel p-6 border border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Dataset / Facility Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-950 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-950 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>Proceed to Data Upload</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
