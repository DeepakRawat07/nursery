import ApiError from '../utils/ApiError.js';

const wishlistPlantSelect = `
  p.id,
  p.name,
  p.slug,
  p.description,
  p.image_url AS "imageUrl",
  p.category,
  p.price::float AS price,
  p.stock,
  p.is_active AS "isActive",
  p.created_at AS "createdAt",
  p.updated_at AS "updatedAt"
`;

export const ensureWishlist = async (executor, userId) => {
  const { rows } = await executor.query(
    `
      INSERT INTO wishlists (user_id)
      VALUES ($1)
      ON CONFLICT (user_id)
      DO UPDATE SET updated_at = NOW()
      RETURNING id, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    [userId]
  );

  return rows[0];
};

export const getWishlistByUserId = async (executor, userId) => {
  const wishlist = await ensureWishlist(executor, userId);
  const { rows } = await executor.query(
    `
      SELECT ${wishlistPlantSelect}
      FROM wishlist_items wi
      JOIN plants p ON p.id = wi.plant_id
      WHERE wi.wishlist_id = $1
        AND p.is_active = TRUE
      ORDER BY wi.id DESC
    `,
    [wishlist.id]
  );

  return {
    id: wishlist.id,
    items: rows,
    itemCount: rows.length
  };
};

export const addWishlistItem = async (executor, userId, plantId) => {
  const wishlist = await ensureWishlist(executor, userId);
  const plantResult = await executor.query(
    `
      SELECT id
      FROM plants
      WHERE id = $1
        AND is_active = TRUE
      LIMIT 1
    `,
    [plantId]
  );

  if (plantResult.rowCount === 0) {
    throw new ApiError(404, 'Plant not found.');
  }

  await executor.query(
    `
      INSERT INTO wishlist_items (wishlist_id, plant_id)
      VALUES ($1, $2)
      ON CONFLICT (wishlist_id, plant_id) DO NOTHING
    `,
    [wishlist.id, plantId]
  );

  return getWishlistByUserId(executor, userId);
};

export const removeWishlistItem = async (executor, userId, plantId) => {
  const wishlist = await ensureWishlist(executor, userId);
  await executor.query(
    `
      DELETE FROM wishlist_items
      WHERE wishlist_id = $1
        AND plant_id = $2
    `,
    [wishlist.id, plantId]
  );

  return getWishlistByUserId(executor, userId);
};
