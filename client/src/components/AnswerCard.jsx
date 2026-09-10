import React, { useState } from 'react';
import { Bot, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export default function AnswerCard({
  answer = "",
  modelUsed = "AI Generation Model",
  activeClaim = null,
  activeClaimType = null
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split answer into sentences for interactive claim highlighting
  const sentences = answer.match(/[^.!?]+[.!?]*/g) || [answer];

  // Helper to test if sentence relates to active claim
  const isSentenceActive = (sentence) => {
    if (!activeClaim) return false;
    const cleanS = sentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const cleanC = activeClaim.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    // Check keyword overlap or substring
    const wordsC = cleanC.split(' ').filter(w => w.length > 3);
    const matchedWords = wordsC.filter(w => cleanS.includes(w));
    return matchedWords.length >= Math.min(2, wordsC.length);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden group">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Raw Generated Answer
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {modelUsed}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Copy answer text"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Answer Content with Interactive Highlighting */}
      <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 min-h-[100px]">
        {sentences.map((sentence, idx) => {
          const isActive = isSentenceActive(sentence);
          let highlightClass = "";
          if (isActive) {
            highlightClass = activeClaimType === "hallucinated"
              ? "bg-rose-500/25 text-rose-950 dark:text-rose-100 px-1 py-0.5 rounded shadow-sm ring-1 ring-rose-500/50"
              : "bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 px-1 py-0.5 rounded shadow-sm ring-1 ring-emerald-500/50";
          }

          return (
            <span
              key={idx}
              className={`transition-all duration-300 inline ${highlightClass}`}
            >
              {sentence}{" "}
            </span>
          );
        })}
      </div>

      {/* Interactive tip */}
      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Tip: Hover or click claims below to highlight source sentences
        </span>
        <span className="font-mono text-[11px]">
          {answer.length} chars
        </span>
      </div>
    </div>
  );
}
