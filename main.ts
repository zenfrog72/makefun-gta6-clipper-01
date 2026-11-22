// Entry program for the make.fun gta6-clipper-01 bounty.
//
// The entry itself is a YouTube video: a GTA VI Trailer 2 moment that an
// AI agent cut into a vertical Short with a make.fun pitch, published
// publicly on YouTube. This program's only job is to hand the video's
// address to the grader: it takes VIDEO.json from the bot directory and
// places a copy in the output directory, where the gate picks it up.
//
// Paths come from the environment so the same file works inside the
// grader's container and in a plain local checkout:
//   MAKEFUN_BOT_DIR     where VIDEO.json lives   (default: /bot)
//   MAKEFUN_OUTPUT_DIR  where the copy must land (default: /output)
//
// Local run:  MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Node standard library only; no dependencies.

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(botDir, 'VIDEO.json');
const destinationPath = join(outputDir, 'VIDEO.json');

// Without the address file there is no entry to hand in, so fail loudly
// instead of writing nothing and letting the gate guess.
if (!existsSync(sourcePath)) {
  console.error(
    `error: VIDEO.json not found at ${sourcePath} ` +
      `(MAKEFUN_BOT_DIR is set to "${botDir}")`,
  );
  process.exit(1);
}

// The output directory may not exist yet on a fresh run; create it
// (and any parents) before copying into it.
mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(sourcePath, destinationPath);
} catch (err) {
  console.error(
    `error: could not copy VIDEO.json from ${sourcePath} to ${destinationPath}: ` +
      `${(err as Error).message}`,
  );
  process.exit(1);
}

console.log(`copied VIDEO.json: ${sourcePath} -> ${destinationPath}`);
