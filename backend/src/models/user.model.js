import { buildPaginatedResponse, getPagination } from '../utils/pagination.js';

const toPublicUserSelect = `
  id,
  name,
  email,
  role,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export const createUser = async (executor, { name, email, passwordHash, role = 'USER' }) => {
  const { rows } = await executor.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING ${toPublicUserSelect}
    `,
    [name, email, passwordHash, role]
  );

  return rows[0];
};

export const findAuthUserByEmail = async (executor, email) => {
  const { rows } = await executor.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        password_hash AS "passwordHash",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

export const findUserById = async (executor, userId) => {
  const { rows } = await executor.query(
    `
      SELECT ${toPublicUserSelect}
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

export const listUsers = async (executor, { page, limit }) => {
  const pagination = getPagination(page, limit);
  const [countResult, dataResult] = await Promise.all([
    executor.query('SELECT COUNT(*)::int AS total FROM users'),
    executor.query(
      `
        SELECT ${toPublicUserSelect}
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
      [pagination.limit, pagination.offset]
    )
  ]);

  return buildPaginatedResponse({
    items: dataResult.rows,
    page: pagination.page,
    limit: pagination.limit,
    totalItems: countResult.rows[0].total
  });
};
