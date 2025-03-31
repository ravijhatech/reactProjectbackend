// backend/controllers/otpController.js
const nodemailer = require('nodemailer');
const User = require('./otpmodel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  return otp;
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ravipratihast71@gmail.com', // Your email address
      pass: 'dtge skiy blrf iltg' // Your email password or app password
    }
  });

  const mailOptions = {
    from: email,
    to: email,
    subject: 'OTP SEND',
    text: `Your OTP code is: ${otp}`,
    html:`<p> Your OTP Code is <b>${otp} </b>it is valid only 10 minutes</p>`
  };

  await transporter.sendMail(mailOptions);
};

// Generate OTP and save to DB
const generateAndSendOTP = async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();
  const otpExpire = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        otp: bcrypt.hashSync(otp.toString(), 10),
        otpExpire
      });
    } else {
      user.otp = bcrypt.hashSync(otp.toString(), 10);
      user.otpExpire = otpExpire;
    }

    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP.', error });
  }
};

module.exports = { generateAndSendOTP };
