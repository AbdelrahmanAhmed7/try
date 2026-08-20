/**
 * Generates WebP images and WOFF2 fonts for production.
 * Run: node scripts/optimize-assets.mjs
 */
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import ttf2woff2 from 'ttf2woff2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'src', 'assets');
const fontsDir = join(assets, 'fonts');
const publicDir = join(root, 'public');

const images = [
  '1.png', '2.png', '3.png', '4.png', '5.png',
  '3ard.jpeg', '3ard2.jpeg', '3ard3.jpeg', 'logo.png',
  'beanut_butter.png', 'beanut_butter_high_protien.png', 'coconut.png', 'prestiege.png',
  'cola/products/healthy_cola.png',
  'cola/products/healthy_lemon.png',
  'cola/offers/combo.jpeg',
  'cola/offers/lama.jpeg',
  'cola/offers/shrink.jpeg',
  'cola/offers/summer.jpeg',
  'bundle/bundle.jpeg', 'bundle/bundle2.jpeg', 'bundle/hero2.png',
];

/** Resize to max width (keeps aspect ratio). null = keep original size. */
const resize = (file) => {
  if (file.startsWith('cola/offers/')) return { width: 800, withoutEnlargement: true };
  if (file.startsWith('bundle/')) return { width: 1000, withoutEnlargement: true };
  if (file.startsWith('3ard')) return { width: 800, withoutEnlargement: true };
  return null;
};

for (const file of images) {
  const input = join(assets, file);
  const out = join(assets, file.replace(/\.(png|jpe?g)$/i, '.webp'));
  let pipeline = sharp(input);
  const r = resize(file);
  if (r) pipeline = pipeline.resize(r);
  await pipeline.webp({ quality: 75 }).toFile(out);
  console.log(`webp: ${basename(out)}`);
}

await mkdir(publicDir, { recursive: true });
await mkdir(join(publicDir, 'fonts'), { recursive: true });
await copyFile(join(assets, '1.webp'), join(publicDir, 'hero-lcp.webp'));
console.log('public/hero-lcp.webp');

for (const ttf of ['Tajawal-Regular.ttf', 'Tajawal-Bold.ttf']) {
  const input = join(fontsDir, ttf);
  const out = join(fontsDir, ttf.replace('.ttf', '.woff2'));
  writeFileSync(out, ttf2woff2(readFileSync(input)));
  await copyFile(out, join(publicDir, 'fonts', basename(out)));
  console.log(`woff2: ${basename(out)}`);
}