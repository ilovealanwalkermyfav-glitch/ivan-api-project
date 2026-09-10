/**
 * Analyze / Generate / Verify Controller
 */

const { v4: uuidv4 } = require('uuid');
const { generateAnswer, verifyAnswer } = require('../services/llmService');
const { validateQuestion, validateVerifyInput } = require('../utils/validators');
const { saveAnalysisToHistory } = require('./history.controller');

/**
 * POST /api/generate
 * Generates an answer to the given question
 */
async function handleGenerate(req, res) {
  try {
    const { question, isDemo = false } = req.body;
    const validation = validateQuestion(question);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const genResult = await generateAnswer(validation.sanitized, Boolean(isDemo));
    return res.status(200).json(genResult);
  } catch (error) {
    console.error('Generate controller error:', error);
    return res.status(500).json({ error: 'Failed to generate answer: ' + error.message });
  }
}

/**
 * POST /api/verify
 * Verifies question + answer + optional referenceText
 */
async function handleVerify(req, res) {
  try {
    const { question, answer, referenceText, isDemo = false } = req.body;
    const validation = validateVerifyInput(question, answer, referenceText);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const verification = await verifyAnswer(
      validation.question,
      validation.answer,
      validation.referenceText,
      Boolean(isDemo)
    );

    return res.status(200).json(verification);
  } catch (error) {
    console.error('Verify controller error:', error);
    return res.status(500).json({ error: 'Failed to verify answer: ' + error.message });
  }
}

/**
 * POST /api/analyze
 * Unified endpoint: generates answer, verifies claims, saves to history, returns full Analysis object
 */
async function handleAnalyze(req, res) {
  try {
    const { question, referenceText, isDemo = false } = req.body;
    const validation = validateQuestion(question);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const sanitizedQuestion = validation.sanitized;
    const sanitizedRef = typeof referenceText === 'string' ? referenceText.trim() : '';

    // Step 1: Generate Answer (Groq + Qwen)
    const genResult = await generateAnswer(sanitizedQuestion, Boolean(isDemo));

    // Step 2: Verify Answer (Google Gemini 3.5 Flash)
    const verification = await verifyAnswer(
      sanitizedQuestion,
      genResult.answer,
      sanitizedRef,
      Boolean(isDemo)
    );

    // Step 3: Construct Dual-Model Analysis Object
    const analysisObject = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      question: sanitizedQuestion,
      referenceText: sanitizedRef,
      generatedAnswer: genResult.answer,
      verification,
      isDemoData: Boolean(isDemo),
      modelUsed: `${genResult.model || 'qwen/qwen3.8-27b'} + ${verification.model || 'gemini-3.5-flash-lite'}`,
      generator: {
        provider: genResult.provider || process.env.LLM_API_PROVIDER || 'groq',
        model: genResult.model || process.env.LLM_MODEL || 'qwen/qwen3.8-27b'
      },
      verifier: {
        provider: verification.provider || process.env.LLM_VERIFIER_PROVIDER || 'gemini',
        model: verification.model || process.env.LLM_VERIFIER_MODEL || 'gemini-3.5-flash-lite'
      }
    };

    // Step 4: Persist to History
    saveAnalysisToHistory(analysisObject);

    return res.status(200).json(analysisObject);
  } catch (error) {
    console.error('[Analyze Controller Error]', error.message);
    return res.status(500).json({
      error: 'Analysis Failed',
      message: error.message
    });
  }
}

module.exports = {
  handleGenerate,
  handleVerify,
  handleAnalyze
};
