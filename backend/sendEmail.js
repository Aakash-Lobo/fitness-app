const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = async (email) => {
  try {
    console.log(`Sending email to ${email}`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Click the link to verify your email: https://brave-smoke-0773e2a1e.6.azurestaticapps.net/verify/${encodeURIComponent(email)}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};


module.exports = sendVerificationEmail;
