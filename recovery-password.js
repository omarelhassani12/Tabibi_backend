const express = require('express');
const recoveryPasswordRouter = express.Router();
const db = require('./db'); 
const nodemailer = require('nodemailer');


recoveryPasswordRouter.post('/password-recovery', async (req, res) => {
    const { email } = req.body;
  
    // TODO: Retrieve the password for the provided email address from the database
  
    // Generate a random password for demonstration purposes
    const newPassword = Math.random().toString(36).slice(-8);
  
    try {
      const transporter = nodemailer.createTransport({
        host: 'your_smtp_host',
        port: 587,
        secure: false,
        auth: {
          user: 'your_smtp_username',
          pass: 'your_smtp_password',
        },
      });
  
      const mailOptions = {
        from: 'your_email_address',
        to: email,
        subject: 'Password Recovery',
        text: `Your new password is: ${newPassword}`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email sent');
  
      // TODO: Update the password in the database for the provided email address
  
      res.status(200).json({ message: 'Password recovery email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  });


  module.exports = recoveryPasswordRouter;