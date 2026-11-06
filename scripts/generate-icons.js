// Script to generate PWA icons from the new Bovest logo
// Run: node scripts/generate-icons.js
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../public/bovest-logo-new.png');
const out = join(__dirname, '../public');

// Generate standard PWA icons with white background (no transparency artifacts from JPEG)
await sharp(src)
  .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(join(out, 'pwa-192x192.png'));

await sharp(src)
  .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(join(out, 'pwa-512x512.png'));

// Also replace the main bovest-logo.png used in the browser tab
await sharp(src)
  .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(join(out, 'bovest-logo.png'));

console.log('✅ All PWA icons generated from new logo!');
