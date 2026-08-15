// Rasterizes the hand-written SVGs in scripts/assets/ into the PNG sizes
// Expo expects under apps/mobile/assets/. Re-run after editing an SVG.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ASSETS_SRC = join(__dirname, "assets");
const ASSETS_OUT = join(__dirname, "..", "apps", "mobile", "assets");

const jobs: { svg: string; out: string; size: number }[] = [
  { svg: "icon-full.svg", out: "icon.png", size: 1024 },
  { svg: "glyph-indigo.svg", out: "splash-icon.png", size: 1024 },
  { svg: "glyph-white.svg", out: "android-icon-foreground.png", size: 512 },
  { svg: "background-only.svg", out: "android-icon-background.png", size: 512 },
  { svg: "glyph-mono.svg", out: "android-icon-monochrome.png", size: 432 },
  { svg: "icon-full.svg", out: "favicon.png", size: 48 },
];

async function main() {
  for (const job of jobs) {
    const svg = readFileSync(join(ASSETS_SRC, job.svg));
    await sharp(svg, { density: 384 })
      .resize(job.size, job.size)
      .png()
      .toFile(join(ASSETS_OUT, job.out));
    console.log(`${job.out} (${job.size}x${job.size}) <- ${job.svg}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
