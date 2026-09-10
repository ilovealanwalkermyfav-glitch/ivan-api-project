const express = require('express');
const router = express.Router();
const { handleGetHealth } = require('../controllers/health.controller');

router.get('/', handleGetHealth);

module.exports = router;
