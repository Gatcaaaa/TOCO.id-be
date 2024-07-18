import Auth from "../auth/auth.model.js";
import OTP from "./otp-verification.model.js";

export default async function VerifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const authDoc = await Auth.findOne({ email });
    if (!authDoc) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const otpDoc = await OTP.findOne({
      email: authDoc._id,
      otp,
    });

    if (!otpDoc) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (otpDoc.otpExpires <= Date.now()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    authDoc.isVerified = true;
    await authDoc.save();
    await OTP.deleteOne({ _id: otpDoc._id });
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (er) {
    res.status(500).json({
      success: false,
      message: er.message,
    });
  }
}
