import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: { sub: string; role: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  try {
    const token = header.slice("Bearer ".length);
    req.user = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret") as { sub: string; role: string };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
