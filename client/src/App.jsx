import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Hero from './components/Hero';
import DisclaimerBanner from './components/DisclaimerBanner';
import InputPanel from './components/InputPanel';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryPanel from './components/HistoryPanel';
import AboutModal from './components/AboutModal';
import {
  checkHealth,
  analyzeQuestion,
  fetchHistory,
  deleteHistoryItem,
  clearAllHistory
} from './services/api';
import { DEMO_CASES } from './data/demoExamples';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('halluguard_theme') || 'dark';
  });

  // Demo Mode state - defaults to true for guaranteed zero-setup demo
  const [isDemoMode, setIsDemoMode] = useState(true);

  // App data state
  const [question, setQuestion] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [history, setHistory] = useState([]);

  // Modals & Drawers
  const [historyOpen, setHistoryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Sync theme with html root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('halluguard_theme', theme);
  }, [theme]);

  // Initial load: health check & history
  useEffect(() => {
    async function init() {
      const health = await checkHealth();
      setHealthStatus(health);
      if (health && health.llmApiConfigured) {
        setIsDemoMode(false);
      }

      const histData = await fetchHistory();
      if (histData && histData.data && histData.data.length > 0) {
        setHistory(histData.data);
      } else {
        // Prepopulate with default demo cases if empty
        setHistory(DEMO_CASES);
      }
    }
    init();
  }, []);

  // Main Analyze Action
  const handleAnalyze = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setCurrentAnalysis(null);
    setErrorMessage(null);

    try {
      // Check if matching an exact demo case when in Demo Mode
      if (isDemoMode) {
        const matchingDemo = DEMO_CASES.find(
          c => c.question.toLowerCase().trim() === question.toLowerCase().trim()
        );
        if (matchingDemo) {
          // Simulate realistic 1.5s thinking time for presentation
          await new Promise(r => setTimeout(r, 1400));
          setCurrentAnalysis(matchingDemo);
          setHistory(prev => [matchingDemo, ...prev.filter(p => p.id !== matchingDemo.id)]);
          setLoading(false);
          setTimeout(() => {
            const el = document.getElementById('results-section');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 450, behavior: 'smooth' });
          }, 100);
          if (matchingDemo.verification.confidence >= 85) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          }
          return;
        }
      }

      // Call backend proxy
      const result = await analyzeQuestion({
        question,
        referenceText,
        isDemo: isDemoMode
      });

      setCurrentAnalysis(result);
      setHistory(prev => [result, ...prev.filter(p => p.id !== result.id)]);

      // Auto-scroll down to results dashboard
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 450, behavior: 'smooth' });
        }
      }, 100);

      if (result.verification && result.verification.confidence >= 85) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Case Selector (PRD Section 12)
  const handleSelectDemoCase = (demoCase) => {
    setQuestion(demoCase.question);
    setReferenceText(demoCase.referenceText || '');
    setCurrentAnalysis(demoCase);
    // Smooth scroll down to results
    setTimeout(() => {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setQuestion('');
    setReferenceText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteHistoryItem(id);
    } catch (e) {
      console.warn('Backend delete history call failed, updating local state', e);
    }
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = async () => {
    try {
      await clearAllHistory();
    } catch (e) {
      console.warn('Backend clear history call failed, updating local state', e);
    }
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Academic Disclaimer Banner (PRD Section 20) */}
      <DisclaimerBanner />

      {/* Global Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        healthStatus={healthStatus}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Introduction */}
        <Hero />

        {/* Query Input Section */}
        <section id="input-section">
          <InputPanel
            question={question}
            setQuestion={setQuestion}
            referenceText={referenceText}
            setReferenceText={setReferenceText}
            onAnalyze={handleAnalyze}
            onSelectDemoCase={handleSelectDemoCase}
            loading={loading}
            isDemoMode={isDemoMode}
          />
        </section>

        {/* Live Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 text-sm animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-rose-900 dark:text-rose-100">Analysis Pipeline Notice</div>
                <div className="text-xs mt-1 leading-relaxed opacity-90">{errorMessage}</div>
                <div className="text-xs mt-2 text-rose-600 dark:text-rose-400 font-medium">
                  💡 Tip: You can switch to <button onClick={() => { setIsDemoMode(true); setErrorMessage(null); }} className="underline font-bold hover:text-rose-900 dark:hover:text-rose-100">Demo Mode</button> in the top header to run 100% offline evaluations without live API calls.
                </div>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 transition-colors shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Visualizer */}
        {loading && <LoadingState />}

        {/* Results Dashboard */}
        {!loading && currentAnalysis && (
          <section id="results-section" className="scroll-mt-20">
            <ResultsDashboard
              analysis={currentAnalysis}
              onReset={handleReset}
            />
          </section>
        )}
      </main>

      {/* Global History Drawer */}
      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectAnalysis={(analysis) => {
          setCurrentAnalysis(analysis);
          setQuestion(analysis.question);
          setReferenceText(analysis.referenceText || '');
        }}
        onDeleteHistoryItem={handleDeleteHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Academic Viva & Architecture Guide Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-950/40 mt-16">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            HalluGuard AI — Detecting Hallucinations in Large Language Models
          </p>
          <p>
            Academic College Minor Project • Full-Stack API Integration Architecture
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-brand-600 dark:text-brand-400 font-medium">
            <button onClick={() => setAboutOpen(true)} className="hover:underline">
              Viva Preparation Guide
            </button>
            <span>•</span>
            <button onClick={() => setIsDemoMode(!isDemoMode)} className="hover:underline">
              {isDemoMode ? "Switch to Live Mode" : "Switch to Demo Mode"}
            </button>
            <span>•</span>
            <button onClick={() => setHistoryOpen(true)} className="hover:underline">
              View History ({history.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
