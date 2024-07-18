import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";
dotenv.config();

const Oauth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new Oauth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.AUTH_EMAIL,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken,
    },
  });

  return transporter;
};

export const sendOtpEmail = async (userEmail, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: {
      name: "RANG Entertainment",
      address: process.env.EMAIL_USER,
    },
    to: userEmail,
    subject: "OTP Verification",
    text: `
      Hi ${userEmail},
  
      Thank you for registering with RANG Entertainment!
  
      To complete your registration, please use the following One-Time Password (OTP) to verify your email address:
  
      OTP: ${otp}
  
      This OTP is valid for the next 60 minutes. If you did not request this, please ignore this email.
  
      If you have any questions, feel free to contact our support team.
  
      Best regards,
      The RANG Entertainment Team
    `,
    html: `
      <p>Hi ${userEmail},</p>
      <p>Thank you for registering with <strong>RANG Entertainment</strong>!</p>
      <p>To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
      <h2 style="color: black;">OTP: ${otp}</h2>
      <p>This OTP is valid for the next <strong>60 minutes</strong>. If you did not request this, please ignore this email.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,</p>
      <p>The RANG Entertainment Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Error sending OTP email", err);
  }
};
