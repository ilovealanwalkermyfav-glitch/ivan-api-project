import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function VerdictBadge({ verdict = "Supported", size = "md" }) {
  const v = (verdict || "").toLowerCase();

  let config = {
    label: verdict,
    bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
    glow: "shadow-emerald-500/10"
  };

  if (v.includes("unsupported") || v.includes("hallucinated")) {
    config = {
      label: "Unsupported / Hallucinated",
      bg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
      icon: XCircle,
      glow: "shadow-rose-500/10"
    };
  } else if (v.includes("partial")) {
    config = {
      label: "Partially Supported",
      bg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      icon: AlertTriangle,
      glow: "shadow-amber-500/10"
    };
  } else if (v.includes("mostly")) {
    config = {
      label: "Mostly Supported",
      bg: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
      icon: CheckCircle2,
      glow: "shadow-teal-500/10"
    };
  } else if (v.includes("unable") || v.includes("unknown")) {
    config = {
      label: "Unable to Verify",
      bg: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      icon: HelpCircle,
      glow: "shadow-slate-500/10"
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === "lg" 
    ? "px-4 py-2 text-base font-semibold gap-2 border" 
    : "px-3 py-1 text-xs sm:text-sm font-medium gap-1.5 border";

  return (
    <span className={`inline-flex items-center rounded-full shadow-sm transition-all ${config.bg} ${config.glow} ${sizeClasses}`}>
      <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      <span>{config.label}</span>
    </span>
  );
}
