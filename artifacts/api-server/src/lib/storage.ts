import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { siteConfig } from "@workspace/db/schema";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(here, "..", "data");
const DEFAULT_FILE = path.join(DATA_DIR, "site.default.json");

async function readDefault(): Promise<unknown> {
  const raw = await fs.readFile(DEFAULT_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function loadSite(): Promise<unknown> {
  const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
  if (rows.length > 0) {
    return rows[0].data;
  }
  const data = await readDefault();
  await db.insert(siteConfig).values({ id: 1, data });
  return data;
}

export async function saveSite(data: unknown): Promise<void> {
  await db
    .insert(siteConfig)
    .values({ id: 1, data })
    .onConflictDoUpdate({
      target: siteConfig.id,
      set: { data, updatedAt: new Date() },
    });
}

export async function resetSite(): Promise<unknown> {
  const data = await readDefault();
  await saveSite(data);
  return data;
}
