import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import env from '../config/env.js';

export const generateOtpCode = () => randomInt(0, 1_000_000).toString().padStart(6, '0');

export const hashOtpCode = (email, otp) =>
  createHash('sha256')
    .update(`${env.jwtSecret}:${email}:${otp}`)
    .digest('hex');

export const verifyOtpCode = (email, otp, storedHash) => {
  const expectedHash = hashOtpCode(email, otp);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (expectedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, storedBuffer);
};
