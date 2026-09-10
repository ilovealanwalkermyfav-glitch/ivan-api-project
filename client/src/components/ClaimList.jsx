import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, Filter, Search, ChevronRight } from 'lucide-react';

export default function ClaimList({
  supportedClaims = [],
  hallucinatedClaims = [],
  activeClaim = null,
  onSelectClaim = () => {}
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'supported' | 'hallucinated'
  const [searchQuery, setSearchQuery] = useState('');

  const filterClaims = (list) => {
    if (!searchQuery.trim()) return list;
    return list.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredSupported = filterClaims(supportedClaims);
  const filteredHallucinated = filterClaims(hallucinatedClaims);

  const totalCount = supportedClaims.length + hallucinatedClaims.length;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Claim-by-Claim Breakdown</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {totalCount} total claims
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discrete assertions extracted and verified by the critic model
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('supported')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              filter === 'supported'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Supported ({supportedClaims.length})
          </button>
          <button
            onClick={() => setFilter('hallucinated')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              filter === 'hallucinated'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <AlertOctagon className="w-3 h-3" />
            Hallucinated ({hallucinatedClaims.length})
          </button>
        </div>
      </div>

      {/* Optional Search Bar if claims > 3 */}
      {totalCount > 3 && (
        <div className="relative mb-4">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search within extracted claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      )}

      {/* Grid of Claims */}
      <div className="space-y-4">
        {/* Potentially Hallucinated Claims Section */}
        {(filter === 'all' || filter === 'hallucinated') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Potentially Hallucinated / Unsupported ({filteredHallucinated.length})
              </h4>
            </div>

            {filteredHallucinated.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                {filter === 'hallucinated' && searchQuery
                  ? "No matching hallucinated claims found."
                  : "No fabricated or unsupported assertions detected in this output."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredHallucinated.map((claim, idx) => {
                  const isSelected = activeClaim === claim;
                  return (
                    <div
                      key={`hallu-${idx}`}
                      onMouseEnter={() => onSelectClaim(claim, "hallucinated")}
                      onMouseLeave={() => onSelectClaim(null, null)}
                      onClick={() => onSelectClaim(isSelected ? null : claim, isSelected ? null : "hallucinated")}
                      className={`p-3.5 rounded-xl border-l-4 border-l-rose-500 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.005] ${
                        isSelected ? "ring-2 ring-rose-500 shadow-rose-500/20" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-rose-950 dark:text-rose-200">
                            {claim}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            Flagged: Contradicts knowledge base or lacks corroborating evidence
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Supported Claims Section */}
        {(filter === 'all' || filter === 'supported') && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Supported Claims ({filteredSupported.length})
              </h4>
            </div>

            {filteredSupported.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                {filter === 'supported' && searchQuery
                  ? "No matching supported claims found."
                  : "No substantiated claims found in the answer."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSupported.map((claim, idx) => {
                  const isSelected = activeClaim === claim;
                  return (
                    <div
                      key={`supp-${idx}`}
                      onMouseEnter={() => onSelectClaim(claim, "supported")}
                      onMouseLeave={() => onSelectClaim(null, null)}
                      onClick={() => onSelectClaim(isSelected ? null : claim, isSelected ? null : "supported")}
                      className={`p-3.5 rounded-xl border-l-4 border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.005] ${
                        isSelected ? "ring-2 ring-emerald-500 shadow-emerald-500/20" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-950 dark:text-emerald-200">
                            {claim}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            Grounded: Corroborated by factual consensus or reference text
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
