const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate a random token for email verification and password reset
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const buildFrontendUrl = (path) => {
  const base =
    process.env.NODE_ENV === "production"
      ? "http://travelinggenie.com"
      : "http://localhost:5173";
  return `${base}${path}`;
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  // Determine the frontend URL based on the environment
  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? "http://travelinggenie.com"
      : "http://localhost:5173";

  console.log("[DEBUG] Environment:", process.env.NODE_ENV);
  console.log("[DEBUG] Frontend URL:", frontendUrl);
  console.log("[DEBUG] Token:", token);

  const verificationUrl = `${frontendUrl}/verify-email/${token}`;
  console.log("[DEBUG] Full verification URL:", verificationUrl);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Verify your TravelGenie account",
    text: `Please click the link below to verify your email address:\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account with TravelGenie, please ignore this email.`,
    html: `
      <h1>Welcome to TravelGenie!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with TravelGenie, please ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Verification email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = buildFrontendUrl(`/reset-password/${token}`);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Reset your TravelGenie password",
    text: `You requested to reset your password. Click the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.`,
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

module.exports = {
  generateToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
