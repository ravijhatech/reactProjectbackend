const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');


const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpire: { type: Date }
});

const User = mongoose.model('User', userSchema);

// Send OTP email function
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: "ravipratihast71@gmail.com",  // Email user
      pass: 'dtge skiy blrf iltg',  // Email password
    },
  });

  const mailOptions = {
    from: 'ravipratihast71@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Generate OTP
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  return otp.toString();
};

// Route to send OTP to email
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
    await user.save();
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await user.save();

  // Send OTP email
  try {
    await sendOtpEmail(email, otp);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send OTP');
  }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  if (user.otpExpire < Date.now()) {
    return res.status(400).send('OTP expired');
  }

  // OTP is valid
  const token = jwt.sign({ email: user.email }, "ravi", { expiresIn: '1h' });
  res.status(200).send({ token });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
