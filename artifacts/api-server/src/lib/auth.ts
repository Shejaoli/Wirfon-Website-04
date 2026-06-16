import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const ADMIN_EMAIL = "admin@wirfon.com";
const ADMIN_PASSWORD = "Wirfon-1!2@";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const SECRET = process.env.SESSION_SECRET ?? crypto.randomBytes(32).toString("hex");

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.alloc(Math.max(a.length, b.length));
  const bb = Buffer.alloc(Math.max(a.length, b.length));
  ab.write(a);
  bb.write(b);
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function login(email: string, password: string): string | null {
  if (!safeEqual(email.padEnd(64), ADMIN_EMAIL.padEnd(64))) return null;
  if (!safeEqual(password.padEnd(64), ADMIN_PASSWORD.padEnd(64))) return null;
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = String(expires);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verify(token: string | null | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  try {
    const sigBuf = Buffer.from(sig.padEnd(64));
    const expBuf = Buffer.from(expected.padEnd(64));
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  } catch {
    return false;
  }
  if (sig !== expected) return false;
  const expires = Number(payload);
  return !Number.isNaN(expires) && Date.now() < expires;
}

export function logout(_token: string | null | undefined): void {
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
