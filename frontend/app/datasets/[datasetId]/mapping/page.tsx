"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Layers, ShieldCheck, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function SchemaMappingPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params?.datasetId as string;

  const [mappings, setMappings] = useState<any[]>([]);
  const [canonicalFields, setCanonicalFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.getMappings(datasetId)
      .then((data) => {
        setMappings(data.mappings || []);
        setCanonicalFields(data.canonical_fields || []);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to load schema mappings");
        setLoading(false);
      });
  }, [datasetId]);

  const handleFieldChange = (index: number, newField: string) => {
    setMappings((prev) => {
      const copy = [...prev];
      copy[index].canonical_field = newField;
      copy[index].confidence = "HIGH"; // user confirmed
      copy[index].is_confirmed = true;
      return copy;
    });
  };

  const handleConfirmAndAnalyze = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      await api.confirmMappings(datasetId, mappings);
      router.push(`/datasets/${datasetId}/analysis`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to confirm mappings.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        <div className="inline-block animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-3" />
        <div>Profiling uploaded columns and analyzing schema...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-xs font-semibold text-indigo-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          AI Schema Understanding
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Confirm Schema Mapping
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review how AI interpreted your data columns into the canonical dark store inventory schema.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Mapping Confirmation Table */}
      <div className="glass-panel overflow-hidden border border-gray-800 rounded-xl shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900/90 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Source File</th>
              <th className="py-3.5 px-4 font-semibold">Uploaded Column</th>
              <th className="py-3.5 px-4 font-semibold">AI Interpretation (Canonical)</th>
              <th className="py-3.5 px-4 font-semibold">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {mappings.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30 transition">
                <td className="py-3 px-4 font-mono text-xs text-gray-400">
                  {m.filename}
                </td>
                <td className="py-3 px-4 font-semibold text-white">
                  {m.source_column}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={m.canonical_field}
                    onChange={(e) => handleFieldChange(idx, e.target.value)}
                    className="w-full max-w-xs px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="unmapped">-- Ignore / Unmapped --</option>
                    {canonicalFields.map((cf) => (
                      <option key={cf.field} value={cf.field}>
                        {cf.field} ({cf.description})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      m.confidence === "HIGH"
                        ? "bg-emerald-950/60 border border-emerald-700/60 text-emerald-300"
                        : m.confidence === "MEDIUM"
                        ? "bg-amber-950/60 border border-amber-700/60 text-amber-300"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {m.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/datasets/${datasetId}/upload`)}
          className="text-sm text-gray-400 hover:text-white"
        >
          Back to Upload
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleConfirmAndAnalyze}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <span>Confirm & Analyze</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
