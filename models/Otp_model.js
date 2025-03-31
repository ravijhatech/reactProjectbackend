const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpire: { type: Date }
});

const Userotp = mongoose.model('Userotp', userSchema);