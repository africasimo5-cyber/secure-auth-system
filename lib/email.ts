import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an OTP verification email to the user.
 */
export const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #eef2f6;">
        <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px; font-size: 24px;">Verify Your Identity</h2>
        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">To ensure your account remains secure, please use the following one-time password (OTP) to complete your verification:</p>
        <div style="text-align: center; margin: 40px 0;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; background: #f7fafc; color: #3182ce; padding: 16px 32px; border-radius: 12px; letter-spacing: 8px; border: 1px dashed #cbd5e0;">${otp}</span>
        </div>
        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 32px;">This code is valid for 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 32px 0;">
        <p style="color: #a0aec0; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Secure Auth System. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send a Password Reset email with a secure link.
 */
export const sendResetEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #eef2f6;">
        <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px; font-size: 24px;">Password Reset Request</h2>
        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new one:</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetLink}" style="background: #3182ce; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);">Reset Password</a>
        </div>
        <p style="color: #718096; font-size: 14px; line-height: 1.6;">If you have trouble clicking the button, copy and paste this link into your browser:</p>
        <p style="color: #3182ce; font-size: 14px; word-break: break-all;">${resetLink}</p>
        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 32px;">This link is valid for 1 hour. If you didn't request this, your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 32px 0;">
        <p style="color: #a0aec0; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Secure Auth System. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
