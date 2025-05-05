const nodemailer = require('nodemailer');

// Create a transporter using the Gmail SMTP server and App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use your Gmail email
    pass: process.env.EMAIL_PASSWORD, // Use the app password generated in Google Account settings
  },
});

// Function to send email
const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: to,                       // List of recipients
    subject: subject,             // Subject line
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
