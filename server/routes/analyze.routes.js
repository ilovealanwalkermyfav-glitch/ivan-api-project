const express = require('express');
const router = express.Router();
const { handleAnalyze } = require('../controllers/analyze.controller');

router.post('/', handleAnalyze);

module.exports = router;
