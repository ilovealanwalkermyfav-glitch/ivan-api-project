/**
 * History Controller
 * Manages persistent storage in server/data/history.json
 */

const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');
const MAX_HISTORY_ENTRIES = 50;

function readHistoryFromFile() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      fs.writeFileSync(HISTORY_FILE, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading history file:', err);
    return [];
  }
}

function writeHistoryToFile(historyArray) {
  try {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyArray, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing history file:', err);
  }
}

function saveAnalysisToHistory(analysis) {
  const current = readHistoryFromFile();
  // Prepend newest analysis
  const updated = [analysis, ...current.filter(item => item.id !== analysis.id)].slice(0, MAX_HISTORY_ENTRIES);
  writeHistoryToFile(updated);
  return updated;
}

/**
 * GET /api/history
 */
function handleGetHistory(req, res) {
  try {
    const history = readHistoryFromFile();
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const paginated = history.slice(offset, offset + limit);

    return res.status(200).json({
      total: history.length,
      limit,
      offset,
      data: paginated
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve history' });
  }
}

/**
 * DELETE /api/history/:id
 */
function handleDeleteHistoryItem(req, res) {
  try {
    const { id } = req.params;
    const history = readHistoryFromFile();
    const filtered = history.filter(item => item.id !== id);
    writeHistoryToFile(filtered);
    return res.status(200).json({ success: true, remaining: filtered.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete history entry' });
  }
}

/**
 * DELETE /api/history
 */
function handleClearHistory(req, res) {
  try {
    writeHistoryToFile([]);
    return res.status(200).json({ success: true, message: 'History cleared successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to clear history' });
  }
}

module.exports = {
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory,
  saveAnalysisToHistory,
  readHistoryFromFile
};
