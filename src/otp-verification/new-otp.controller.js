import Auth from "../auth/auth.model.js";
import { otpGen } from "otp-gen-agent";
import OTP from "./otp-verification.model.js";
import { sendOtpEmail } from "../util/email-sender.js";

export default async function NewOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const authDoc = await Auth.findOne({ email });
    if (!authDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = await otpGen();
    const otpExpires = Date.now() + 3600000;

    let otpDoc = await OTP.findOne({ email: authDoc._id });

    if (!otpDoc) {
      otpDoc = new OTP({
        email: authDoc._id,
        otp,
        otpExpires,
      });
    } else {
      otpDoc.otp = otp;
      otpDoc.otpExpires = otpExpires;
    }

    await otpDoc.save();
    await sendOtpEmail(email, otp);
    res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
}
