import db from './db.js';

export const ensurePendingRegistrationsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pending_registrations (
      email VARCHAR(255) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      password_hash TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_pending_registrations_expires_at
    ON pending_registrations (expires_at)
  `);
};
