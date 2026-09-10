import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 1200);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Querying Generation API",
      desc: "Invoking first-stage LLM to produce raw answer...",
      icon: Bot
    },
    {
      id: 2,
      title: "Decomposing Claims",
      desc: "Isolating atomic factual propositions from response tokens...",
      icon: Sparkles
    },
    {
      id: 3,
      title: "Skeptical Critic Verification",
      desc: "Evaluating claims against reference grounding and fact consensus...",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto my-8 transition-all border-violet-500/30 shadow-violet-500/10 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          HalluGuard Pipeline in Progress
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          Orchestrating multi-model critique pass to detect hallucinations and confabulations
        </p>

        {/* Step Progress Indicators */}
        <div className="w-full mt-6 space-y-3">
          {steps.map((s) => {
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30 shadow-sm"
                    : isDone
                    ? "bg-slate-100/50 dark:bg-slate-850/50 border border-emerald-500/20 opacity-80"
                    : "opacity-40 border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-violet-600 text-white animate-pulse"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {s.title}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-medium text-violet-500 animate-pulse">
                        Active...
                      </span>
                    )}
                    {isDone && (
                      <span className="text-xs font-medium text-emerald-500">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shimmer skeleton lines */}
        <div className="w-full mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-4/5 mx-auto animate-pulse"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-3/5 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
