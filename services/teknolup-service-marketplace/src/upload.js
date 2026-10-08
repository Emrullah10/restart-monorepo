import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadMiddleware = multer({ storage }).array('images', 5);

// Returns paths relative to the API root (not a full origin) so the mobile
// client can prefix them with whatever host/port it already resolved
// (emulator alias, LAN IP, prod domain) via ApiService.baseUrl.
export const buildImageUrls = (files) =>
  files.map((file) => `/marketplace/uploads/${file.filename}`);
