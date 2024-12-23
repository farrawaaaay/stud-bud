import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; // Set in your .env.local

export function generateToken(userId) {
  if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined in .env.local");
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token) {
  if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined in .env.local");
  return jwt.verify(token, SECRET_KEY);
}
