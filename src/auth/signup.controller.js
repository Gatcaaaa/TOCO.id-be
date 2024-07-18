import Auth from "./auth.model.js";
import bcryptjs from "bcryptjs";
import { otpGen } from "otp-gen-agent";
import { sendOtpEmail } from "../util/email-sender.js";

export default async function Signup(req, res) {
  const { username, email, password } = req.body;

  if (
    !email ||
    !password ||
    !username ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const otp = await otpGen();

  const newUser = new Auth({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    await sendOtpEmail(email, otp);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (er) {
    res.status(500).json({
      success: false,
      message: er.message,
    });
  }
}
