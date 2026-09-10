const express = require('express');
const router = express.Router();
const {
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory
} = require('../controllers/history.controller');

router.get('/', handleGetHistory);
router.delete('/:id', handleDeleteHistoryItem);
router.delete('/', handleClearHistory);

module.exports = router;
