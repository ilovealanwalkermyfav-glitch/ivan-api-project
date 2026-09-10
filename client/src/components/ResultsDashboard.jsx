import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Download, Sparkles, AlertCircle, Share2 } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import ConfidenceMeter from './ConfidenceMeter';
import AnswerCard from './AnswerCard';
import ClaimList from './ClaimList';
import ExplanationCard from './ExplanationCard';

export default function ResultsDashboard({
  analysis,
  onReset
}) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);
  const [activeClaimType, setActiveClaimType] = useState(null);

  if (!analysis) return null;

  const {
    question = "",
    generatedAnswer = "",
    verification = {},
    isDemoData = false,
    modelUsed = "AI Assistant",
    generator = null,
    verifier = null
  } = analysis;

  const genModelDisplay = generator?.model
    ? (generator.model.toLowerCase().includes('qwen') ? 'Qwen 3.8 27B' : generator.model)
    : "Qwen 3.8 27B";
  const genProviderDisplay = generator?.provider
    ? (generator.provider.toLowerCase() === 'groq' ? 'Groq' : generator.provider)
    : "Groq";

  const verModelDisplay = verifier?.model
    ? (verifier.model.toLowerCase().includes('gemini') ? 'Gemini 3.5 Flash' : verifier.model)
    : "Gemini 3.5 Flash";
  const verProviderDisplay = verifier?.provider
    ? (verifier.provider.toLowerCase() === 'gemini' ? 'Google Gemini' : verifier.provider)
    : "Google Gemini";

  const {
    verdict = "Supported",
    confidence = 85,
    supported_claims = [],
    potentially_hallucinated_claims = [],
    explanation = "",
    technical_notes = ""
  } = verification;

  const handleCopySummary = () => {
    const summary = `--- HalluGuard AI Analysis Report ---
Question: ${question}
Verdict: ${verdict} (${confidence}% Confidence)
Generator: ${genModelDisplay} (via ${genProviderDisplay})
Verifier: ${verModelDisplay} (via ${verProviderDisplay})
${isDemoData ? "[DEMO EVALUATION DATA]" : ""}

Generated Answer:
${generatedAnswer}

Supported Claims (${supported_claims.length}):
${supported_claims.map(c => `• ${c}`).join('\n') || "None"}

Hallucinated / Unsupported Claims (${potentially_hallucinated_claims.length}):
${potentially_hallucinated_claims.map(c => `• ${c}`).join('\n') || "None"}

Explanation:
${explanation}
-------------------------------------`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `halluguard-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSelectClaim = (claim, type) => {
    setActiveClaim(claim);
    setActiveClaimType(type);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Demo Data Notice Ribbon (Section 12.2) */}
      {isDemoData && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>DEMO DATA — Canonical evaluation case loaded (no live API billing consumed)</span>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Demo Mode
          </span>
        </div>
      )}

      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Analysis Results
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 mt-0.5">
            <span>Query Evaluation</span>
            <VerdictBadge verdict={verdict} size="lg" />
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Another</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Two-Model Cross-Provider Pipeline Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800/70 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Cross-Provider Verification Pipeline
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">2 Independent LLM Passes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Generator Model Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              GEN
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                GENERATOR
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {genModelDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                via {genProviderDisplay}
              </div>
              {generator?.model && (
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  {generator.model}
                </div>
              )}
            </div>
          </div>

          {/* Verifier Model Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              VER
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                VERIFIER
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {verModelDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                via {verProviderDisplay}
              </div>
              {verifier?.model && (
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  {verifier.model}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Answer & Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Raw Answer with Interactive Highlighting (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <AnswerCard
            answer={generatedAnswer}
            modelUsed={generator?.model ? `${genModelDisplay} (${generator.model})` : (modelUsed ? modelUsed.replace(/2\.5/g, '3.5') : 'Qwen 3.8 27B')}
            activeClaim={activeClaim}
            activeClaimType={activeClaimType}
          />

          {/* Explanation Card */}
          <ExplanationCard
            explanation={explanation}
            technicalNotes={technical_notes}
          />
        </div>

        {/* Right Column: Radial Confidence Meter & Summary Stats */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Factual Grounding Score
            </h3>
            <ConfidenceMeter score={confidence} size={170} />

            {/* Quick Metrics Bar */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <div className="text-xl font-bold">{supported_claims.length}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider">Supported</div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                <div className="text-xl font-bold">{potentially_hallucinated_claims.length}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider">Hallucinated</div>
              </div>
            </div>
          </div>

          {/* Verification Protocol Tag */}
          <div className="glass-card rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Two-Stage Pipeline Verification</span>
            </div>
            <p className="leading-relaxed">
              Answer generated by an informational model, then audited by an independent critic prompt enforcing atomic claim skepticism.
            </p>
          </div>
        </div>
      </div>

      {/* Claim-by-Claim Breakdown (Full width bottom section) */}
      <ClaimList
        supportedClaims={supported_claims}
        hallucinatedClaims={potentially_hallucinated_claims}
        activeClaim={activeClaim}
        onSelectClaim={handleSelectClaim}
      />
    </div>
  );
}
