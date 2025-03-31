// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpire: { type: Date, required: true }
});

const OTPUser = mongoose.model('OTPUser', userSchema);

module.exports = OTPUser;
