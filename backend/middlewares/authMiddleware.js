// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// -------------------------------
// 1) VERIFY JWT FOR ANY USER
// -------------------------------
export function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";
    const decoded = jwt.verify(token, secret);

    /*
      decoded = {
        id: "userId",
        role: "doctor" | "patient",
        email: "..."
      }
    */

    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// -------------------------------
// 2) DOCTOR ONLY AUTH
// -------------------------------
export function requireDoctor(req, res, next) {
  if (!req.user || req.user.role !== "doctor") {
    return res.status(403).json({ message: "Doctor access required" });
  }
  next();
}

// -------------------------------
// 3) PATIENT ONLY AUTH
// -------------------------------
export function requirePatient(req, res, next) {
  if (!req.user || req.user.role !== "patient") {
    return res.status(403).json({ message: "Patient access required" });
  }
  next();
}

// -------------------------------
// 4) (MOST IMPORTANT)
//    UNIFIED AUTH FOR CHAT 
//    → doctor OR patient allowed
// -------------------------------
export function doctorPatientAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "doctor" && decoded.role !== "patient") {
      return res.status(403).json({
        message: "Only doctor or patient can access this resource",
      });
    }

    req.user = decoded;   // { id, role, email }
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("doctorPatientAuth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
