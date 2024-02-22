const nodemailer = require("nodemailer");
const generateOTP = require("./generateOtp");
const fs = require("fs");

const { BREVO_HOST, BREVO_PORT, BREVO_USER, BREVO_PASS } = process.env;
const sendEmail = (user, otp) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: BREVO_HOST,
      port: BREVO_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: BREVO_USER,
        pass: BREVO_PASS,
      },
    });

    // Read the content of html template
    const welcomeEmail = fs.readFileSync(
      __dirname + "/email_templates/Welcome_Email.html",
      "utf-8"
    );

    // Replace placeholders with actual user data
    const userData = {
      username: user?.username,
      email: user.email,
    };

    // Replace placeholders in the email template
    const formattedEmail = welcomeEmail
      .replace(/{{username}}/g, userData.username)
      .replace(/{{email}}/g, userData.email);

    const mailOptions = {
      from: '"Gamefolio" noreply@gamefolio.com', // sender address
      to: userData.email,
      subject: "Welcome to Gamefolio", // Subject line
      html: formattedEmail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject("Error sending OTP");
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        resolve("OTP sent successfully");
      }
    });
  });
};

const sendForgotOtpEmail = (email, otp) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: BREVO_HOST,
      port: BREVO_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: BREVO_USER,
        pass: BREVO_PASS,
      },
    });

    // Read the content of html template
    const forgetOtpEmail = fs.readFileSync(
      __dirname + "/email_templates/Forgotten_Password.html",
      "utf-8"
    );

    // Replace placeholders with actual user data
    const userData = {
      email: email,
      otp: otp,
    };

    // Replace placeholders in the email template
    const formattedEmail = forgetOtpEmail
      .replace(/{{email}}/g, userData.email)
      .replace(/{{otp}}/g, userData.otp);

    const mailOptions = {
      from: '"Gamefolio" noreply@gamefolio.com', // sender address
      to: email,
      subject: "Reset Password - Gamefolio", // Subject line
      html: formattedEmail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject("Error sending OTP");
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        resolve("OTP sent successfully");
      }
    });
  });
};

module.exports = { sendEmail, sendForgotOtpEmail };
