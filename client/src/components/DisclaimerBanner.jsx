import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 dark:bg-amber-950/30 border-y border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="leading-snug">
            <strong className="font-semibold text-amber-600 dark:text-amber-400">Academic Disclaimer: </strong>
            HalluGuard AI uses a secondary AI verification pass to estimate claim support. This is a probabilistic estimate—not a guarantee of factual truth. Always verify critical facts against trusted primary sources.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-100 p-1 rounded-md transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
