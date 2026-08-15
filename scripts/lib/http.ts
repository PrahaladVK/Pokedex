import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache", "pokeapi");

function cachePathFor(url: string): string {
  const safe = url
    .replace("https://pokeapi.co/api/v2/", "")
    .replace(/\/$/, "")
    .replace(/[/?&=]/g, "_");
  return join(CACHE_DIR, `${safe || "root"}.json`);
}

/** Fetches a PokeAPI JSON resource, caching the raw response on disk so re-runs are fast and idempotent. */
export async function fetchJson<T = unknown>(url: string, retries = 4): Promise<T> {
  const cachePath = cachePathFor(url);
  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, "utf-8")) as T;
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
      const json = (await res.json()) as T;
      mkdirSync(dirname(cachePath), { recursive: true });
      writeFileSync(cachePath, JSON.stringify(json));
      return json;
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw lastError;
}

/** A simple concurrency limiter so we don't hammer PokeAPI with thousands of parallel requests. */
export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const runNext = () => {
    active--;
    const job = queue.shift();
    if (job) job();
  };

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++;
        fn().then(
          (value) => {
            resolve(value);
            runNext();
          },
          (err) => {
            reject(err);
            runNext();
          },
        );
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
  };
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Could not extract id from url: ${url}`);
  return Number(match[1]);
}
