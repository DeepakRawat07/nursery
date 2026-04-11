import ApiError from '../utils/ApiError.js';

export const ensureCart = async (executor, userId) => {
  const { rows } = await executor.query(
    `
      INSERT INTO carts (user_id)
      VALUES ($1)
      ON CONFLICT (user_id)
      DO UPDATE SET updated_at = NOW()
      RETURNING id, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    [userId]
  );

  return rows[0];
};

export const getCartByUserId = async (executor, userId) => {
  const cart = await ensureCart(executor, userId);
  const { rows } = await executor.query(
    `
      SELECT
        ci.id,
        ci.quantity,
        p.id AS "plantId",
        p.name,
        p.category,
        p.price::float AS price,
        p.image_url AS "imageUrl",
        p.stock,
        (p.price * ci.quantity)::float AS subtotal
      FROM cart_items ci
      JOIN plants p ON p.id = ci.plant_id
      WHERE ci.cart_id = $1
      ORDER BY ci.id DESC
    `,
    [cart.id]
  );

  return {
    id: cart.id,
    items: rows,
    itemCount: rows.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: Number(rows.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2))
  };
};

export const addItemToCart = async (executor, userId, plantId, quantity) => {
  const cart = await ensureCart(executor, userId);
  const plantResult = await executor.query(
    `
      SELECT id, stock, is_active AS "isActive"
      FROM plants
      WHERE id = $1
      LIMIT 1
    `,
    [plantId]
  );
  const plant = plantResult.rows[0];

  if (!plant || !plant.isActive) {
    throw new ApiError(404, 'Plant not found.');
  }

  const existingItemResult = await executor.query(
    `
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = $1 AND plant_id = $2
      LIMIT 1
    `,
    [cart.id, plantId]
  );
  const existingItem = existingItemResult.rows[0];
  const nextQuantity = (existingItem?.quantity || 0) + quantity;

  if (nextQuantity > plant.stock) {
    throw new ApiError(400, 'Requested quantity exceeds current stock.');
  }

  if (existingItem) {
    await executor.query(
      `
        UPDATE cart_items
        SET quantity = $1, updated_at = NOW()
        WHERE id = $2
      `,
      [nextQuantity, existingItem.id]
    );
  } else {
    await executor.query(
      `
        INSERT INTO cart_items (cart_id, plant_id, quantity)
        VALUES ($1, $2, $3)
      `,
      [cart.id, plantId, quantity]
    );
  }

  return getCartByUserId(executor, userId);
};

export const updateCartItemQuantity = async (executor, userId, itemId, quantity) => {
  const { rows } = await executor.query(
    `
      SELECT
        ci.id,
        ci.cart_id AS "cartId",
        ci.plant_id AS "plantId",
        p.stock
      FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      JOIN plants p ON p.id = ci.plant_id
      WHERE ci.id = $1 AND c.user_id = $2
      LIMIT 1
    `,
    [itemId, userId]
  );
  const item = rows[0];

  if (!item) {
    throw new ApiError(404, 'Cart item not found.');
  }

  if (quantity > item.stock) {
    throw new ApiError(400, 'Requested quantity exceeds current stock.');
  }

  await executor.query(
    `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2
    `,
    [quantity, itemId]
  );

  return getCartByUserId(executor, userId);
};

export const removeCartItem = async (executor, userId, itemId) => {
  const cart = await ensureCart(executor, userId);
  await executor.query(
    `
      DELETE FROM cart_items
      WHERE id = $1
        AND cart_id = $2
    `,
    [itemId, cart.id]
  );

  return getCartByUserId(executor, userId);
};
