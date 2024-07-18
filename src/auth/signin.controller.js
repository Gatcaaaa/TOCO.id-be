import { generateToken } from "../util/jwt-token.js";
import Auth from "./auth.model.js";
import bcryptjs from "bcryptjs";

export default async function Signin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.json({
      success: true,
      message: "User signed in successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
