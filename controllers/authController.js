const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const sendEmail = require('../utils/emailUtil');

// Register
exports.register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Define HTML content for the email
    const html = `
      <html>
        <body>
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up to our platform. We're excited to have you on board!</p>
          <p>Your account has been successfully created. You can now log in to the system and start exploring the features.</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The Farm Waste Management Team</strong></p>
        </body>
      </html>
    `;

    // Send the email with the HTML content
    await sendEmail(email, 'Welcome to Farm Waste Management System', html);

    res.status(201).json({ message: "User registered successfully ✅. A confirmation email has been sent!" });
  } catch (err) {
    console.error('Error occurred during registration:', err);
    res.status(500).json({ error: err.message });
  }
};




// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found with this email" });

    const token = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    user.resetPasswordToken = token;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const htmlContent = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

    await sendEmail(user.email, 'Password Reset', htmlContent);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset link" });
  }
};

// Reset password route
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() } // check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting password' });
  }
};