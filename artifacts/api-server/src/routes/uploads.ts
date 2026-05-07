import { Router, type IRouter } from "express";
import express from "express";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireAdmin } from "../lib/auth";

const here = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(here, "..", "data", "uploads");

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const router: IRouter = Router();

router.post(
  "/admin/uploads",
  requireAdmin,
  express.raw({ type: () => true, limit: "12mb" }),
  async (req, res) => {
    try {
      const contentType = String(req.headers["content-type"] || "")
        .split(";")[0]
        .trim()
        .toLowerCase();
      const ext = ALLOWED[contentType];
      if (!ext) {
        res.status(415).json({
          error: "Unsupported file type. Use PNG, JPG, WEBP, GIF, or SVG.",
        });
        return;
      }
      const body = req.body as Buffer | undefined;
      if (!body || !Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ error: "Empty upload" });
        return;
      }
      if (body.length > 10 * 1024 * 1024) {
        res.status(413).json({ error: "File too large (max 10 MB)" });
        return;
      }
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const filename = `${Date.now().toString(36)}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
      const dest = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(dest, body);
      res.json({ url: `/api/uploads/${filename}`, filename });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message || "Upload failed" });
    }
  },
);

router.get("/uploads/:filename", async (req, res) => {
  const name = String(req.params.filename || "");
  if (!/^[A-Za-z0-9._-]+$/.test(name) || name.includes("..")) {
    res.status(400).end();
    return;
  }
  const file = path.join(UPLOADS_DIR, name);
  try {
    const stat = await fs.stat(file);
    const ext = path.extname(name).slice(1).toLowerCase();
    const mime = EXT_TO_MIME[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Length", String(stat.size));
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    createReadStream(file).pipe(res);
  } catch {
    res.status(404).end();
  }
});

export default router;
