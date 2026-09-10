const express = require('express');
const router = express.Router();
const { handleVerify } = require('../controllers/analyze.controller');

router.post('/', handleVerify);

module.exports = router;
