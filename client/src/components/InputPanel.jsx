import React, { useState } from 'react';
import { Send, FileText, ChevronDown, ChevronUp, RotateCcw, AlertCircle } from 'lucide-react';
import ExampleChips from './ExampleChips';

export default function InputPanel({
  question,
  setQuestion,
  referenceText,
  setReferenceText,
  onAnalyze,
  onSelectDemoCase,
  loading = false,
  isDemoMode = false
}) {
  const [showRef, setShowRef] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onAnalyze();
  };

  const handleSelectExample = (ex) => {
    setQuestion(ex.question);
    if (ex.ref) {
      setReferenceText(ex.ref);
      setShowRef(true);
    } else {
      setReferenceText('');
    }
  };

  const handleClear = () => {
    setQuestion('');
    setReferenceText('');
  };

  return (
    <div className={`glass-panel rounded-2xl p-5 sm:p-7 transition-all ${shake ? 'animate-bounce ring-2 ring-rose-500' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Question Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>Prompt / Question</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {question && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear
                </button>
              )}
              <span className="text-xs font-mono text-slate-400">
                {question.length}/1000
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 1000))}
              placeholder="e.g., What is the capital of Australia? Or ask about a historical figure..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-inner"
              disabled={loading}
            />
          </div>
        </div>

        {/* Collapsible Reference Text Area */}
        <div>
          <button
            type="button"
            onClick={() => setShowRef(!showRef)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showRef ? "Hide Reference / Grounding Text" : "+ Add Reference Evidence Text (Optional Grounding)"}</span>
            {showRef ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showRef && (
            <div className="mt-2.5 transition-all">
              <textarea
                rows={2}
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value.slice(0, 1500))}
                placeholder="Paste verified factual background, Wikipedia passage, or document excerpts to evaluate the answer against..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                disabled={loading}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                If provided, the verification engine will measure whether claims are grounded in this text.
              </p>
            </div>
          )}
        </div>

        {/* Example Chips & 3 Demo Cases */}
        <ExampleChips
          onSelectExample={handleSelectExample}
          onSelectDemoCase={onSelectDemoCase}
        />

        {/* Submit Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Demo Mode active: Instant heuristic pipeline enabled
              </span>
            ) : (
              <span>Orchestrates: Model Generation → Proposition Decomposition → Critic Pass</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`gradient-btn px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold w-full sm:w-auto shadow-md ${
              loading || !question.trim() ? 'opacity-50 cursor-not-allowed scale-100' : ''
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Analyzing Pipeline..." : "Analyze Answer"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
