import React, { useState } from 'react';
import { Lightbulb, Code2, BookOpen, Layers } from 'lucide-react';

export default function ExplanationCard({
  explanation = "",
  technicalNotes = ""
}) {
  const [activeTab, setActiveTab] = useState('plain'); // 'plain' | 'technical'

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 transition-all">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Verification Insights
          </h3>
        </div>

        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('plain')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'plain'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Plain Summary
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'technical'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3 h-3" />
            Viva / Technical Note
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'plain' ? (
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-cyan-500/5 dark:bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/20">
          <p>{explanation || "No explanation provided for this verification run."}</p>
        </div>
      ) : (
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-slate-900/80 text-slate-200 p-4 rounded-xl border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Critic Model Reasoning Trace:</span>
          </div>
          <p className="text-slate-300">
            {technicalNotes || explanation || "Heuristic proposition parsing executed across response tokens."}
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
            Method: Two-stage zero-shot decomposition with skeptical epistemic verification prompt.
          </div>
        </div>
      )}
    </div>
  );
}
