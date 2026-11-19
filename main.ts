// gta6-meme-x-01 entry runner (Node 22, standard library only).
//
// The entry itself is the X post carrying the meme; this program only hands
// the grader the post's address, by copying POST.json from the bot directory
// into the output directory where the grader reads it.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, "POST.json"), join(OUTPUT_DIR, "POST.json"));
  console.log(`POST.json copied from ${BOT_DIR} to ${OUTPUT_DIR}`);
} catch (err) {
  console.error(`Could not copy POST.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Sanity check the copied file: the grader refuses a placeholder URL, so warn
// loudly while POST.json still points at <handle>/<id> instead of a real post.
try {
  const data = JSON.parse(readFileSync(join(OUTPUT_DIR, "POST.json"), "utf8")) as { url?: unknown };
  if (typeof data.url !== "string" || data.url.includes("<handle>") || data.url.includes("<id>")) {
    console.warn("WARNING: POST.json still holds a placeholder URL — replace it with the real X post URL before submitting.");
  } else {
    console.log(`Post URL: ${data.url}`);
  }
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
