/**
 * Health & Demo Controller
 */

const fs = require('fs');
const path = require('path');

const DEMO_CASES_FILE = path.join(__dirname, '..', 'data', 'demoCases.json');

function handleGetHealth(req, res) {
  const genProvider = (process.env.LLM_API_PROVIDER || 'groq').toLowerCase();
  const genApiKey = process.env.LLM_API_KEY || '';
  const genConfigured = Boolean(genApiKey && genApiKey.trim().length > 5 && !genApiKey.includes('your_'));

  const verProvider = (process.env.LLM_VERIFIER_PROVIDER || 'gemini').toLowerCase();
  const verApiKey = process.env.GEMINI_API_KEY || '';
  const verConfigured = Boolean(verApiKey && verApiKey.trim().length > 5 && !verApiKey.includes('your_'));

  return res.status(200).json({
    status: 'ok',
    server: 'running',
    llmProvider: `${genProvider} + ${verProvider}`,
    llmApiConfigured: genConfigured && verConfigured,
    llmApiReachable: true,
    generator: {
      provider: genProvider,
      model: process.env.LLM_MODEL || 'qwen/qwen3.8-27b',
      configured: genConfigured
    },
    verifier: {
      provider: verProvider,
      model: process.env.LLM_VERIFIER_MODEL || 'gemini-3.5-flash-lite',
      configured: verConfigured
    },
    timestamp: new Date().toISOString()
  });
}

function handleGetDemoExamples(req, res) {
  try {
    if (fs.existsSync(DEMO_CASES_FILE)) {
      const data = JSON.parse(fs.readFileSync(DEMO_CASES_FILE, 'utf8'));
      return res.status(200).json(data);
    }
    return res.status(200).json([]);
  } catch (err) {
    console.error('Error loading demo cases:', err);
    return res.status(500).json({ error: 'Failed to load demo cases' });
  }
}

module.exports = {
  handleGetHealth,
  handleGetDemoExamples
};
