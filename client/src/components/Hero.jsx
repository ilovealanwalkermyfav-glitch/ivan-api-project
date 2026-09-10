import React from 'react';
import { ShieldCheck, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center py-6 sm:py-10 max-w-3xl mx-auto px-4">
      {/* Small Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span>Dual-Stage LLM Verification Architecture</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-none">
        Can you trust every <br className="hidden sm:inline" />
        <span className="gradient-text">AI answer?</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Large Language Models produce confident statements that may be subtly inaccurate or fabricated.
        HalluGuard AI generates an answer, then deploys a second skeptical critic to detect, score, and explain hallucinations.
      </p>

      {/* Feature Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Two-Call Critic Architecture
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          Claim-by-Claim Auditing
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 font-medium">
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          Zero-Setup Offline Demo
        </span>
      </div>
    </div>
  );
}
