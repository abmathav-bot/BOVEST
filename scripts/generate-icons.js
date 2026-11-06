// Script to generate PWA icons from bovest-logo.png
// Run: node scripts/generate-icons.js
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../public/bovest-logo.png');
const out = join(__dirname, '../public');

await sharp(src).resize(192, 192).toFile(join(out, 'pwa-192x192.png'));
await sharp(src).resize(512, 512).toFile(join(out, 'pwa-512x512.png'));

console.log('✅ PWA icons generated!');
