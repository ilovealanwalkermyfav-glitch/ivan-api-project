const express = require('express');
const router = express.Router();
const { handleGenerate } = require('../controllers/analyze.controller');

router.post('/', handleGenerate);

module.exports = router;
