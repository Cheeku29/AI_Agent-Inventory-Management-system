"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Trash2, 
  AlertCircle,
  FileSpreadsheet,
  Boxes
} from "lucide-react";
import { api } from "@/lib/api";

export default function DatasetUploadPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params?.datasetId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndProceed = async () => {
    if (files.length === 0) {
      setErrorMsg("Please select at least one CSV, XLSX, or Parquet file to upload.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    try {
      await api.uploadFiles(datasetId, files);
      router.push(`/datasets/${datasetId}/mapping`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload files.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
          Universal Data Ingestion
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Upload Inventory Datasets
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload CSV, Excel, or Parquet files from your WMS or ERP. Any column headers are supported.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-sm text-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-2xl p-10 text-center bg-gray-900/40 hover:bg-gray-900/70 transition"
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".csv,.xlsx,.xls,.parquet"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
          <UploadCloud className="h-8 w-8" />
        </div>
        <div className="text-base font-semibold text-white">
          Click to upload or drag and drop files here
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Supports CSV, XLSX, Parquet (e.g. inventory.csv, sales.csv, products.csv, suppliers.csv)
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Files Staged for Ingestion ({files.length})
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900/80 border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{file.name}</div>
                    <div className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB &bull; {file.type || "file"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation action */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/datasets")}
          className="text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={uploading || files.length === 0}
          onClick={handleUploadAndProceed}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          {uploading ? (
            <span>Profiling & Ingesting Files...</span>
          ) : (
            <>
              <span>Confirm & Profile Data</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
