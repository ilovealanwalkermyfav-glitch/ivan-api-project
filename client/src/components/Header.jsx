import React from 'react';
import { Bot, Sun, Moon, Sparkles, History, HelpCircle, Shield, Wifi, WifiOff } from 'lucide-react';

export default function Header({
  theme,
  setTheme,
  isDemoMode,
  setIsDemoMode,
  healthStatus,
  onOpenHistory,
  onOpenAbout,
  historyCount = 0
}) {
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const isServerOnline = healthStatus?.status === 'ok';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                HalluGuard <span className="gradient-text">AI</span>
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                v1.0 Minor Project
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Detect. Verify. Understand.
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Server Health Status Dot */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            title={
              isServerOnline
                ? `Backend online (Provider: ${healthStatus?.llmProvider || 'mock'})`
                : 'Backend offline or reconnecting'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isServerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="hidden md:inline font-mono text-[11px]">
              {isServerOnline ? 'API Ready' : 'Connecting'}
            </span>
          </div>

          {/* Demo Mode Switch (Section 12.2) */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isDemoMode
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500 shadow-sm shadow-violet-500/30'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle offline demo mode (zero API billing/internet required)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Mode</span>
            <span
              className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                isDemoMode ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              {isDemoMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Viva / About Modal Button */}
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Viva Prep & Architecture Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            title="View query history"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Toggle Dark / Light mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
