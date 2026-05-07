import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(here, "..", "data");
const SITE_FILE = path.join(DATA_DIR, "site.json");
const DEFAULT_FILE = path.join(DATA_DIR, "site.default.json");

let cache: unknown = null;
let writeChain: Promise<void> = Promise.resolve();

export async function loadSite(): Promise<unknown> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(SITE_FILE, "utf-8");
    cache = JSON.parse(raw);
  } catch {
    const raw = await fs.readFile(DEFAULT_FILE, "utf-8");
    cache = JSON.parse(raw);
  }
  return cache;
}

export async function saveSite(data: unknown): Promise<void> {
  cache = data;
  writeChain = writeChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SITE_FILE, JSON.stringify(data, null, 2), "utf-8");
  });
  return writeChain;
}

export async function resetSite(): Promise<unknown> {
  const raw = await fs.readFile(DEFAULT_FILE, "utf-8");
  const data = JSON.parse(raw);
  await saveSite(data);
  return data;
}
