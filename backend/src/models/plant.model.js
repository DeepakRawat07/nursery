import ApiError from '../utils/ApiError.js';
import { buildPaginatedResponse, getPagination } from '../utils/pagination.js';
import { slugify } from '../utils/slug.js';

const plantSelect = `
  id,
  name,
  slug,
  description,
  image_url AS "imageUrl",
  category,
  price::float AS price,
  stock,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const SORT_MAP = {
  newest: 'created_at DESC, id DESC',
  priceAsc: 'price ASC, id ASC',
  priceDesc: 'price DESC, id DESC',
  nameAsc: 'name ASC, id ASC',
  stockDesc: 'stock DESC, id ASC'
};

const buildFilters = (filters = {}, includeInactive = false) => {
  const conditions = [];
  const params = [];

  if (!includeInactive) {
    conditions.push('is_active = TRUE');
  }

  if (filters.q) {
    params.push(`%${filters.q}%`);
    conditions.push(
      `(name ILIKE $${params.length} OR description ILIKE $${params.length} OR category ILIKE $${params.length})`
    );
  }

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`category = $${params.length}`);
  }

  if (filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`price >= $${params.length}`);
  }

  if (filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`price <= $${params.length}`);
  }

  if (filters.inStock === true) {
    conditions.push('stock > 0');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return { whereClause, params };
};

const ensureUniqueSlug = async (executor, name, excludePlantId = null) => {
  const baseSlug = slugify(name);
  let attempt = 0;

  while (attempt < 50) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const params = excludePlantId ? [candidate, excludePlantId] : [candidate];
    const exclusionClause = excludePlantId ? 'AND id <> $2' : '';
    const { rowCount } = await executor.query(
      `
        SELECT 1
        FROM plants
        WHERE slug = $1
        ${exclusionClause}
        LIMIT 1
      `,
      params
    );

    if (rowCount === 0) {
      return candidate;
    }

    attempt += 1;
  }

  throw new ApiError(409, 'Unable to generate a unique slug for the plant.');
};

export const listPlants = async (executor, filters = {}, options = {}) => {
  const pagination = getPagination(filters.page, filters.limit);
  const { whereClause, params } = buildFilters(filters, options.includeInactive === true);
  const orderBy = SORT_MAP[filters.sort] || SORT_MAP.newest;

  const [countResult, dataResult] = await Promise.all([
    executor.query(`SELECT COUNT(*)::int AS total FROM plants ${whereClause}`, params),
    executor.query(
      `
        SELECT ${plantSelect}
        FROM plants
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, pagination.limit, pagination.offset]
    )
  ]);

  return buildPaginatedResponse({
    items: dataResult.rows,
    page: pagination.page,
    limit: pagination.limit,
    totalItems: countResult.rows[0].total
  });
};

export const findPlantById = async (executor, plantId, { includeInactive = false } = {}) => {
  const { rows } = await executor.query(
    `
      SELECT ${plantSelect}
      FROM plants
      WHERE id = $1
        ${includeInactive ? '' : 'AND is_active = TRUE'}
      LIMIT 1
    `,
    [plantId]
  );

  return rows[0] || null;
};

export const createPlant = async (executor, payload) => {
  const slug = await ensureUniqueSlug(executor, payload.name);
  const { rows } = await executor.query(
    `
      INSERT INTO plants (name, slug, description, image_url, category, price, stock, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, TRUE))
      RETURNING ${plantSelect}
    `,
    [
      payload.name,
      slug,
      payload.description,
      payload.imageUrl,
      payload.category,
      payload.price,
      payload.stock,
      payload.isActive
    ]
  );

  return rows[0];
};

export const updatePlant = async (executor, plantId, payload) => {
  const entries = Object.entries(payload);
  const values = [];
  const updates = [];

  for (const [key, value] of entries) {
    const columnMap = {
      name: 'name',
      description: 'description',
      imageUrl: 'image_url',
      category: 'category',
      price: 'price',
      stock: 'stock',
      isActive: 'is_active'
    };

    if (!columnMap[key]) {
      continue;
    }

    if (key === 'name') {
      const slug = await ensureUniqueSlug(executor, value, plantId);
      values.push(value);
      updates.push(`name = $${values.length}`);
      values.push(slug);
      updates.push(`slug = $${values.length}`);
      continue;
    }

    values.push(value);
    updates.push(`${columnMap[key]} = $${values.length}`);
  }

  values.push(plantId);

  const { rows } = await executor.query(
    `
      UPDATE plants
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING ${plantSelect}
    `,
    values
  );

  return rows[0] || null;
};

export const softDeletePlant = async (executor, plantId) => {
  const { rows } = await executor.query(
    `
      UPDATE plants
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = $1
      RETURNING ${plantSelect}
    `,
    [plantId]
  );

  return rows[0] || null;
};
