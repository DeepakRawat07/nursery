import ApiError from '../utils/ApiError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePasswordStrength = (password) => {
  const strongEnough =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!strongEnough) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
    );
  }
};

export const validateRegisterPayload = (payload) => {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '')
    .trim()
    .toLowerCase();
  const password = String(payload.password || '');

  if (name.length < 2) {
    throw new ApiError(400, 'Name must be at least 2 characters long.');
  }

  if (!emailPattern.test(email)) {
    throw new ApiError(400, 'A valid email address is required.');
  }

  validatePasswordStrength(password);

  return { name, email, password };
};

export const validateRegisterOtpVerifyPayload = (payload) => {
  const email = String(payload.email || '')
    .trim()
    .toLowerCase();
  const otp = String(payload.otp || '')
    .replace(/\D/g, '')
    .slice(0, 6);

  if (!emailPattern.test(email)) {
    throw new ApiError(400, 'A valid email address is required.');
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, 'Enter the 6-digit verification code sent to your email.');
  }

  return { email, otp };
};

export const validateLoginPayload = (payload) => {
  const email = String(payload.email || '')
    .trim()
    .toLowerCase();
  const password = String(payload.password || '');

  if (!emailPattern.test(email) || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  return { email, password };
};
