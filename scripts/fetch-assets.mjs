#!/usr/bin/env node
/**
 * Downloads every real Icey Locs image (their GlossGenius portfolio, team avatars, service
 * thumbnails and iceylocs.com images) into /public/images, converting to optimized JPEG/WebP.
 *
 *   npm run assets:fetch
 *
 * Reads URLs straight out of src/data/*.ts so the data files stay the single source of truth.
 * Requires: sharp (devDependency). Safe to re-run; existing files are skipped unless --force.
 */
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
let sharp = null;
try {
  sharp = (await import("sharp")).default; // optional: optimizes + writes WebP twins when installed
} catch {
  console.log("sharp not installed — saving originals as-is (npm i -D sharp to optimize).");
}

const ROOT = process.cwd();
const FORCE = process.argv.includes("--force");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function pairsFrom(file, re) {
  const src = await readFile(join(ROOT, file), "utf8");
  const out = [];
  for (const m of src.matchAll(re)) out.push({ file: m[1], src: m[2] });
  return out;
}

const P_PREFIX = "https://static.glossgenius.com/public/portfolioimage/";
const GG_SERVICE = "https://static.glossgenius.com/public/service/";

// gallery.ts items: { file: "...", src: P + "..." } or src: "https://..."
const galleryRaw = await readFile(join(ROOT, "src/data/gallery.ts"), "utf8");
const jobs = [];
for (const m of galleryRaw.matchAll(/file:\s*"([^"]+)",\s*src:\s*(P \+ )?"([^"]+)"/g)) {
  const url = m[2] ? P_PREFIX + m[3] : m[3];
  if (url.startsWith("http")) jobs.push({ file: m[1], src: url });
}

// services.ts thumbnails -> /images/services/<id>.jpg
const servicesRaw = await readFile(join(ROOT, "src/data/services.ts"), "utf8");
for (const m of servicesRaw.matchAll(/id:\s*"([a-z0-9-]+)",\s*\n\s*slug:[\s\S]*?glossGeniusImage:\s*GG \+ "([^"]+)"/g)) {
  jobs.push({ file: `/images/services/${m[1]}.jpg`, src: GG_SERVICE + m[2] });
}

let ok = 0;
let skipped = 0;
const failed = [];
for (const job of jobs) {
  const dest = join(ROOT, "public", job.file);
  if (!FORCE && (await exists(dest))) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(job.src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    if (!sharp) {
      await writeFile(dest, buf);
      ok++;
      console.log("ok   ", job.file);
      continue;
    }
    const img = sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true });
    const out = job.file.endsWith(".png") ? await img.png({ compressionLevel: 9 }).toBuffer() : await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    await writeFile(dest, out);
    // matching WebP for <picture>
    if (!job.file.endsWith(".png")) {
      await writeFile(dest.replace(/\.jpe?g$/, ".webp"), await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer());
    }
    ok++;
    console.log("ok   ", job.file);
  } catch (e) {
    failed.push(`${job.file} <- ${job.src} (${e.message})`);
  }
}
console.log(`\nDownloaded ${ok}, skipped ${skipped}, failed ${failed.length} of ${jobs.length}.`);
if (failed.length) {
  console.error(failed.join("\n"));
  process.exit(1);
}
