import { Router, type IRouter } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(here, "..", "data");
const SUBS_FILE = path.join(DATA_DIR, "subscribers.json");

async function addSubscriber(email: string): Promise<void> {
  let list: string[] = [];
  try {
    const raw = await fs.readFile(SUBS_FILE, "utf-8");
    list = JSON.parse(raw);
  } catch { /* file doesn't exist yet */ }
  const normalised = email.trim().toLowerCase();
  if (!list.includes(normalised)) {
    list.push(normalised);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SUBS_FILE, JSON.stringify(list, null, 2), "utf-8");
  }
}

const router: IRouter = Router();

router.post("/contact", (req, res) => {
  req.log.info({ body: req.body }, "contact form submission");
  res.json({ success: true, message: "Thank you, we will be in touch shortly." });
});

router.post("/subscribe", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }
  req.log.info({ email }, "newsletter subscription");
  await addSubscriber(email);
  res.json({ success: true, message: "Thank you for subscribing! We'll be in touch." });
});

export default router;
