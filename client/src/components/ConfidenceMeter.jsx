import React, { useEffect, useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function ConfidenceMeter({ score = 0, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(Math.max(parseInt(score, 10) || 0, 0), 100);
    const duration = 800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment >= 0 && start >= end) || (increment < 0 && start <= end)) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG parameters
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine dynamic color based on score
  let strokeColor = "#10b981"; // emerald-500
  let glowColor = "rgba(16, 185, 129, 0.3)";
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let statusText = "High Grounding";

  if (animatedScore < 40) {
    strokeColor = "#f43f5e"; // rose-500
    glowColor = "rgba(244, 63, 94, 0.3)";
    textColor = "text-rose-600 dark:text-rose-400";
    statusText = "Low / High Risk";
  } else if (animatedScore < 75) {
    strokeColor = "#f59e0b"; // amber-500
    glowColor = "rgba(245, 158, 11, 0.3)";
    textColor = "text-amber-600 dark:text-amber-400";
    statusText = "Moderate Grounding";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transition-all duration-300"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800/80"
          />
          {/* Progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s ease"
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
              {animatedScore}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            {statusText}
          </span>
        </div>
      </div>

      {/* Footnote / Tooltip */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 text-center max-w-[220px]">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span title="AI-estimated confidence — not a guarantee of factual accuracy">
          AI-estimated confidence
        </span>
      </div>
    </div>
  );
}
