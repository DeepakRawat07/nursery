import crypto from 'node:crypto';

const SCRYPT_COST = {
  N: 16384,
  r: 8,
  p: 1,
  keyLength: 64,
  maxmem: 64 * 1024 * 1024
};

const runScrypt = (password, salt, keyLength = SCRYPT_COST.keyLength, overrides = {}) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      keyLength,
      {
        N: overrides.N || SCRYPT_COST.N,
        r: overrides.r || SCRYPT_COST.r,
        p: overrides.p || SCRYPT_COST.p,
        maxmem: SCRYPT_COST.maxmem
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      }
    );
  });

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await runScrypt(password, salt);
  return `scrypt$${SCRYPT_COST.N}$${SCRYPT_COST.r}$${SCRYPT_COST.p}$${salt}$${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password, storedValue) => {
  const [algorithm, N, r, p, salt, hash] = storedValue.split('$');

  if (algorithm !== 'scrypt' || !salt || !hash) {
    return false;
  }

  const parsedHash = Buffer.from(hash, 'hex');
  const derivedKey = await runScrypt(password, salt, parsedHash.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p)
  });

  return crypto.timingSafeEqual(derivedKey, parsedHash);
};
