import { verifyToken } from "../util/jwt-token.js";

export default function authenticate(req, res, next) {
  const token = req.header("authorization").replace("Bearer ", "");

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (er) {
    return res.status(403).json({ message: "Access denied. Invalid token." });
  }
}
