import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import env from './env.js';

const uploadPath = path.resolve(env.uploadDir);
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadPath);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new Error('Only image uploads are allowed.'));
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter
});
