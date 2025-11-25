// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";  // 👈 EXACT SAME
    const decoded = jwt.verify(token, secret);

    req.user = decoded; // { id, role, email, ... }
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
