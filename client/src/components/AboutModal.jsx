import React, { useState } from 'react';
import { X, BookOpen, Cpu, ShieldCheck, AlertTriangle, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('concepts'); // 'concepts' | 'viva' | 'architecture'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                HalluGuard AI — Academic & Viva Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                College Minor Project Documentation & Technical Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'concepts'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Core Concepts & Mechanics</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>System Pipeline & Design</span>
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'viva'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Viva Cheat Sheet (Q&A)</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {activeTab === 'concepts' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-violet-500/5 dark:bg-violet-950/20 border border-violet-500/20">
                <h4 className="text-sm font-bold text-violet-800 dark:text-violet-300 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-violet-500" />
                  What is an LLM Hallucination?
                </h4>
                <p className="text-xs sm:text-sm">
                  An LLM hallucination occurs when an AI produces text that appears fluent, confident, and grammatically impeccable, yet is factually incorrect, ungrounded, or entirely fabricated.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Why do Hallucinations happen?
                </h4>
                <p className="text-xs sm:text-sm">
                  Large Language Models are <strong>next-token predictors</strong> trained to generate statistically probable continuations of text. They do not possess a database of ground truth or an epistemic awareness of what they don't know. When asked about obscure topics or fictional entities, they complete the sentence pattern with plausible-sounding words (stochastic confabulation).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  The Dual-Call Verification Architecture
                </h4>
                <p className="text-xs sm:text-sm">
                  Rather than relying on single-pass generation or custom training, HalluGuard AI uses a <strong>two-stage critic pattern</strong>:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Stage 1 (Generator):</strong> Optimized for fluency, completeness, and direct answering.</li>
                  <li><strong>Stage 2 (Critic Verifier):</strong> Prompted with a skeptical epistemic role to isolate atomic propositions and actively audit whether evidence supports each claim.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Academic Limitations & Honest Reporting
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>The critic itself is an AI model; it produces probabilistic heuristics, not mathematically guaranteed truth.</li>
                  <li>False positives (flagging obscure true facts as ungrounded) and false negatives (missing plausible falsehoods) can occur.</li>
                  <li>Grounding is strongest when user provides reference text or queries established historical consensus.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="font-mono text-xs p-4 rounded-2xl bg-slate-900 text-cyan-300 border border-slate-700 overflow-x-auto">
                <pre>{`[User Input] (Question + Reference)
      │
      ▼
[Express Server: POST /api/analyze]
      │
      ├─► Step 1: Call Generation LLM ──► [Raw Answer]
      │
      ├─► Step 2: Extract Propositions & Invoke Critic Pass
      │           (Strict JSON Schema Prompt)
      │
      ├─► Step 3: Defensive JSON Parser & Repair Utility
      │
      ├─► Step 4: Persist Analysis in history.json
      │
      ▼
[React Frontend Dashboard]
   ├── Confidence Meter (Radial SVG Gauge)
   ├── Verdict Badge (Color coded status)
   ├── Interactive Claim Cross-Highlighting
   └── Historical Query Replay`}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">Frontend Layer</div>
                  <p className="text-slate-500">React.js, Vite, Tailwind CSS, Lucide Icons, Glassmorphism design system.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">Backend Layer</div>
                  <p className="text-slate-500">Node.js, Express.js REST endpoints, Multi-provider LLM adapter, Persistent JSON storage.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-950/30 border border-brand-500/20 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                Common questions college evaluators / professors ask during project viva:
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-1">
                    Q1: "Did you train your own Machine Learning model for this project?"
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Answer:</strong> "No, sir. This is an <em>API-integration-focused architecture</em>. Instead of training a model from scratch, we designed a multi-stage critic pipeline using modern LLM APIs with structured prompt engineering and defensive JSON schema parsing to evaluate and classify claims."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-1">
                    Q2: "Why use two LLM calls instead of asking for verification in the first prompt?"
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Answer:</strong> "When a single prompt generates both the answer and critique, confirmation bias occurs—the model tends to defend its own generated output. Splitting into two independent calls with distinct system personas (Generator vs. Skeptical Fact Checker) ensures an objective audit."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-1">
                    Q3: "How does Demo Mode work if the internet or API keys fail in the lab?"
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Answer:</strong> "The project includes a 100% offline Demo Mode with canonical benchmark test cases (Supported, Misconception, Complete Hallucination) and an offline heuristic proposition parser so the entire pipeline and UI can be demonstrated without external network access."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">HalluGuard AI • College Minor Project</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
