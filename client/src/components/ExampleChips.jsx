import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { EXAMPLE_QUESTIONS, DEMO_CASES } from '../data/demoExamples';

export default function ExampleChips({ onSelectExample, onSelectDemoCase }) {
  return (
    <div className="space-y-3.5">
      {/* 3 Predefined Demo Case Buttons (Section 12) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Interactive Demo Cases (Viva Ready)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Case 1 */}
          <button
            type="button"
            onClick={() => onSelectDemoCase(DEMO_CASES[0])}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 transition-all text-left group"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">Case 1: Supported Fact</div>
              <div className="text-[11px] opacity-75 truncate">Telephone inventor (94%)</div>
            </div>
          </button>

          {/* Case 2 */}
          <button
            type="button"
            onClick={() => onSelectDemoCase(DEMO_CASES[1])}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-200 transition-all text-left group"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">Case 2: Misconception</div>
              <div className="text-[11px] opacity-75 truncate">Capital of Australia (35%)</div>
            </div>
          </button>

          {/* Case 3 */}
          <button
            type="button"
            onClick={() => onSelectDemoCase(DEMO_CASES[2])}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-800 dark:text-rose-200 transition-all text-left group"
          >
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">Case 3: Complete Hallucination</div>
              <div className="text-[11px] opacity-75 truncate">Fictional scientist (8%)</div>
            </div>
          </button>
        </div>
      </div>

      {/* General Example Question Chips */}
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Or choose a test query:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectExample(ex)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <span>{ex.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
