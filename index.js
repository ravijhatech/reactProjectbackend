// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const StudentRegistration = require('./studentRegistrationmodel');



const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpire: { type: Date }
});

const Userotp = mongoose.model('Userotp', userSchema);

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
  let user = await Userotp.findOne({ email });
  if (!user) {
    user = new Userotp({ email });
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

  const user = await Userotp.findOne({ email });
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
  const token = jwt.sign({ email: user.email }, "securetkey", { expiresIn: '1h' });
  res.status(200).send({ token });
});

// Routes
// app.use('/api/otp', otpRoutes);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (username == "" || email == "" || password == "")
    return res.json({ message: "all fields is requried" });
  const userexits = await User.findOne({ email });
  if (userexits)
    return res.json({ message: "user already exists" });
  const haspassword = await bcrypt.hash(password, 10);

  let user = await User.create({ username, email, password: haspassword });
  res.json({ message: "user created sucessfully ", sucess: true })


});




// change password 

// Password Change Route
app.post("/change-password", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validate fields
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Password match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });

  // Send email notification password change

  try {

    const transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      service: 'gmail',  // Or any other email service
      auth: {
        user: "ravipratihast71@gmail.com",
        pass: 'dtge skiy blrf iltg',
      }
    });

    const mailOptions = {
      from: "ravipratihast71@gmail.com",
      to: user.email,
      subject: 'Password Reset Request',
      html: "Your Password changed sucessfully"
                 
    };

    transporter.sendMail(mailOptions, (error, info) => {
     
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }

});




// app.put('/changed-password', async (req, res) => {
//   const { email,newpassword,confirmPassword} = req.body;
  
  
//   try {
//     const user = await User.findOne({email});
   
//     if(!user){
//       return res.json({message:"user not found"});
//     }
//     // const isMatch =await bcrypt.compare(newpassword,user.password);
   
//     // if(isMatch){
       
    
//       //  res.json({message:"old password is match"});
      
//       const haspassword = await bcrypt.hash(newpassword,10)
//       user.password = haspassword;
//       await user.save();
//       res.json({message:"Password changed sucessfully"});
//     // }
//   } catch (error) {
//     res.json({message:"password not changed",error});
    
//   }

// })




//New Student Addmission 

app.post('/student-addmission', async (req, res) => {
  const { studentFirstName, stustudentLastName, dateOfBirth, gender, bloodGroup, category, phoneNumber, email, currentAddress, city, state, pincode, admissionNumber, enrollmentNumber, className, section, previousSchoolName, stream, yearsofAddmission, fatherName, motherName, occupation, relatioshipwithStudent, passportSizePhoto, birthCertificate, previousMarksheet, transferCertificate, aadharCard, casteCertificate, transportRequried } = req.body;
  const register = await StudentRegistration.findOne({ studentFirstName });
  if (register)
    return res.json({ message: "Student already Register" });
  let user = await StudentRegistration.create({  studentFirstName, stustudentLastName, dateOfBirth, gender, bloodGroup, category, phoneNumber, email, currentAddress, city, state, pincode, admissionNumber, enrollmentNumber, className, section, previousSchoolName, stream, yearsofAddmission, fatherName, motherName, occupation, relatioshipwithStudent, passportSizePhoto, birthCertificate, previousMarksheet, transferCertificate, aadharCard, casteCertificate, transportRequried  });
  res.json({ message: "New Addmission Register sucessfully ", sucess: true });

    // Send email notification password change

    try {

      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        service: 'gmail',  // Or any other email service
        auth: {
          user: "ravipratihast71@gmail.com",
          pass: 'dtge skiy blrf iltg',
        }
      });
  
      const mailOptions = {
        from: "ravipratihast71@gmail.com",
        to: user.email,
        subject: 'Password Reset Request',
        html: "Registration Form Submit sucessfully"
                   
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
       
        
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }


})

// All addmission student 

app.get("/student-addmission/fetch", async (req, res) => {
  try {
    const fetchuserdata = await StudentRegistration.find();
    res.json(fetchuserdata);


  } catch (error) {
    res.json({ message: 'Data fetching error' });


  }

})



app.get("/register/fetch", async (req, res) => {
  try {
    const fetchuserdata = await User.find();
    res.json(fetchuserdata);


  } catch (error) {
    res.json({ message: 'Data fetching error' });


  }

})





// Reset Password Request Route
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User with this email does not exist');

    // Generate a reset token
    const token = jwt.sign({ email: user.email }, "securetkey", {
      expiresIn: '1h'
    });

    // Save the token and its expiration date to the user document
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send email with the reset password link
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Or any other email service
      auth: {
        user: "ravipratihast71@gmail.com",
        pass: 'dtge skiy blrf iltg',
      }
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: "ravipratihast71@gmail.com",
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                 <p><a href="${resetLink}">Reset Password</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Password reset link sent to email');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});







// Forgot Password route (token generation)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("No user with that email found.");

    const resetToken = Math.random().toString(36).substr(2, 8);  // Generate a simple reset token
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

    await user.save();

    // Send token via email (use nodemailer to send an actual email in real implementation)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    res.status(200).send("Password reset token sent.");
  } catch (err) {
    res.status(500).send("Server error.");
  }
});







app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "")
    return res.json({ message: "All field is requried" });
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "user not exits", sucess: false });
  const validpassword = await bcrypt.compare(password, user.password);
  console.log(validpassword);

  if (!validpassword)
    return res.json({ message: "Invalid password" });
  const token = jwt.sign({ user: user }, 'securetkey', { expiresIn: '1h' });
  res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });  // 1days
  user.token = token;
  await user.save();

  res.json({ message: `welcome`, token, sucess: true });


});
// protected routes
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) return res.json({ message: "access denied" });

  try {
    const decoded = jwt.verify(token, "securetkey");
    req.user = decoded;
    next();
  } catch (error) {
    res.json({ message: "invalid token" });

  }

};



app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "proteted route accessd", user: req.user });
});

// logout Api

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out sucessfully" });
});

mongoose.connect("mongodb+srv://ravipratihast71:jPoRfADyx0J54rU3@cluster0.hkwcuwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/reactProjectDB")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
