const express = require('express');
const router = express.Router();
const { handleGetDemoExamples } = require('../controllers/health.controller');

router.get('/', handleGetDemoExamples);

module.exports = router;
