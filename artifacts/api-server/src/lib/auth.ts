import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const ADMIN_EMAIL = "admin@wirfon.com";
const ADMIN_PASSWORD = "Wirfon-1!2@";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const tokens = new Map<string, number>();

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function login(email: string, password: string): string | null {
  if (!safeEqual(email, ADMIN_EMAIL)) return null;
  if (!safeEqual(password, ADMIN_PASSWORD)) return null;
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

export function verify(token: string | null | undefined): boolean {
  if (!token) return false;
  const exp = tokens.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    tokens.delete(token);
    return false;
  }
  return true;
}

export function logout(token: string | null | undefined): void {
  if (!token) return;
  tokens.delete(token);
}

function tokenFromReq(req: Request): string | null {
  const auth = req.headers.authorization;
  if (typeof auth !== "string") return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = tokenFromReq(req);
  if (!verify(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function getToken(req: Request): string | null {
  return tokenFromReq(req);
}
