// Downloads a Material Symbols Outlined subset (only icons listed in src/shared/iconNames.js) to public/fonts.
import { writeFileSync, mkdirSync } from 'node:fs';
import { ICON_NAMES } from '../src/shared/iconNames.js';

const names = [...ICON_NAMES].sort().join(',');
const cssUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400..700,0..1,0&icon_names=${names}&display=block`;
const css = await (await fetch(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36' } })).text();
const m = css.match(/url\((https:[^)]+)\)/);
if (!m) throw new Error('font url not found:\n' + css.slice(0, 300));
const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
mkdirSync('public/fonts', { recursive: true });
writeFileSync('public/fonts/material-symbols-subset.woff2', buf);
console.log(`icon subset: ${ICON_NAMES.length} icons, ${buf.length} bytes`);
