import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const JOKE = "The tooth fairy only pays in coins because she's minting memories.";

function charCount(text: string): number {
  return [...text].length;
}

function validateJoke(text: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > 200) {
    throw new Error(`joke must be 1-200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be whitespace-only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be exactly one line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 && ch !== "\t") {
      throw new Error(`joke contains a control character U+${code.toString(16).padStart(4, "0")}`);
    }
  }
}

function resolveOutDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim().length > 0) {
    return resolve(fromEnv);
  }
  return "/output";
}

function main(): void {
  validateJoke(JOKE);
  const outDir = resolveOutDir();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), JOKE, "utf8");
}

main();
