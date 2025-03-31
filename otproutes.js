// backend/routes/otp.js
const express = require('express');
const { generateAndSendOTP } = require('./otpcontrooler');
const router = express.Router();

router.post('/send-otp', generateAndSendOTP);

module.exports = router;
