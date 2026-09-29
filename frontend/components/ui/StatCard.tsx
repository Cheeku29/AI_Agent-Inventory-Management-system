"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card } from "./Card";
import { clsx } from "clsx";

export interface StatCardProps {
  label: string;
  value: string | number;
  supportingText?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  variant?: "default" | "critical" | "warning" | "success";
}

export function StatCard({
  label,
  value,
  supportingText,
  trend,
  icon,
  variant = "default",
}: StatCardProps) {
  const borderVariants = {
    default: "border-slate-200 hover:border-slate-300",
    critical: "border-red-200 bg-red-50/20 hover:border-red-300",
    warning: "border-amber-200 bg-amber-50/20 hover:border-amber-300",
    success: "border-emerald-200 bg-emerald-50/20 hover:border-emerald-300",
  }[variant];

  const valueVariants = {
    default: "text-slate-900",
    critical: "text-red-700",
    warning: "text-amber-800",
    success: "text-emerald-700",
  }[variant];

  return (
    <Card className={clsx("p-5 flex flex-col justify-between transition-all", borderVariants)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className={clsx("text-2xl sm:text-3xl font-bold tracking-tight", valueVariants)}>
          {value}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={clsx(
                "inline-flex items-center font-semibold rounded px-1.5 py-0.5",
                trend.isNeutral
                  ? "bg-slate-100 text-slate-600"
                  : trend.isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {trend.isNeutral ? (
                <Minus className="h-3 w-3 mr-0.5" />
              ) : trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
          {supportingText && (
            <span className="text-slate-500 font-normal truncate">{supportingText}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
