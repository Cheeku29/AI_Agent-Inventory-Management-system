"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  Trash2, 
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
      setErrorMsg("Please select at least one CSV, XLSX, or Parquet file.");
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
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <PageHeader
        title="Upload Facility Datasets"
        description="Ingest CSV, Excel, or Parquet files from your WMS, ERP, or spreadsheet exports."
        breadcrumbs={[
          { label: "Data Sources", href: "/datasets" },
          { label: "File Ingestion" },
        ]}
      />

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-10 text-center bg-white hover:bg-blue-50/20 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".csv,.xlsx,.xls,.parquet"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="h-12 w-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div className="text-sm font-semibold text-slate-900">
          Click to upload or drag and drop files here
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Supports CSV, XLSX, Parquet (e.g. inventory.csv, sales.csv, products.csv, suppliers.csv)
        </div>
      </div>

      {/* Staged Files List */}
      {files.length > 0 && (
        <Card className="p-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700">
            Files Staged for Ingestion ({files.length})
          </div>
          <div className="space-y-1.5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-900">{file.name}</span>
                  <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          onClick={() => router.push("/datasets")}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={files.length === 0}
          isLoading={uploading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={handleUploadAndProceed}
        >
          Confirm & Profile Schema
        </Button>
      </div>
    </div>
  );
}
