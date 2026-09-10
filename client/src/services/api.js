/**
 * Axios API Service for HalluGuard Backend Proxy
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function checkHealth() {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (error) {
    return {
      status: 'error',
      server: 'offline',
      llmApiConfigured: false,
      llmApiReachable: false,
      error: error.message
    };
  }
}

export async function fetchDemoCases() {
  try {
    const res = await api.get('/demo-examples');
    return res.data;
  } catch (error) {
    console.warn('Falling back to local demo cases:', error);
    return null;
  }
}

export async function analyzeQuestion({ question, referenceText, isDemo = false }) {
  const res = await api.post('/analyze', {
    question,
    referenceText,
    isDemo
  });
  return res.data;
}

export async function generateRawAnswer(question) {
  const res = await api.post('/generate', { question });
  return res.data;
}

export async function verifyRawAnswer({ question, answer, referenceText }) {
  const res = await api.post('/verify', { question, answer, referenceText });
  return res.data;
}

export async function fetchHistory(limit = 50, offset = 0) {
  try {
    const res = await api.get(`/history?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return { total: 0, data: [] };
  }
}

export async function deleteHistoryItem(id) {
  const res = await api.delete(`/history/${id}`);
  return res.data;
}

export async function clearAllHistory() {
  const res = await api.delete('/history');
  return res.data;
}

export default api;
