import React, { useState } from 'react';
import { History, X, Trash2, Search, ExternalLink, Sparkles, Clock } from 'lucide-react';
import VerdictBadge from './VerdictBadge';

export default function HistoryPanel({
  isOpen,
  onClose,
  history = [],
  onSelectAnalysis,
  onDeleteHistoryItem,
  onClearHistory
}) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter(item =>
    (item.question || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.verification?.verdict || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Analysis History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} persistent query logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* List of Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {search ? "No logs match your filter." : "No queries saved yet. Run an analysis to populate history."}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/40 bg-slate-50/60 dark:bg-slate-850/60 transition-all hover:shadow-md group relative"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 flex-1">
                    {item.question}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5">
                    <VerdictBadge verdict={item.verification?.verdict} size="sm" />
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                      {item.verification?.confidence}%
                    </span>
                    {item.isDemoData && (
                      <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded font-mono">
                        Demo
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onSelectAnalysis(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>Load</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(item.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
