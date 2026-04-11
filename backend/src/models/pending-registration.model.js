const pendingRegistrationSelect = `
  email,
  name,
  password_hash AS "passwordHash",
  otp_hash AS "otpHash",
  expires_at AS "expiresAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export const upsertPendingRegistration = async (
  executor,
  { email, name, passwordHash, otpHash, expiresAt }
) => {
  const { rows } = await executor.query(
    `
      INSERT INTO pending_registrations (email, name, password_hash, otp_hash, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        otp_hash = EXCLUDED.otp_hash,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW()
      RETURNING ${pendingRegistrationSelect}
    `,
    [email, name, passwordHash, otpHash, expiresAt]
  );

  return rows[0];
};

export const findPendingRegistrationByEmail = async (executor, email) => {
  const { rows } = await executor.query(
    `
      SELECT ${pendingRegistrationSelect}
      FROM pending_registrations
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

export const deletePendingRegistration = async (executor, email) => {
  await executor.query('DELETE FROM pending_registrations WHERE email = $1', [email]);
};
