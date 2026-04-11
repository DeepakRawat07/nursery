import { query, withTransaction } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import { buildPaginatedResponse, getPagination } from '../utils/pagination.js';
import { ensureCart } from './cart.model.js';

const orderSelect = `
  o.id,
  o.user_id AS "userId",
  o.total_price::float AS "totalPrice",
  o.status,
  o.shipping_name AS "shippingName",
  o.shipping_email AS "shippingEmail",
  o.shipping_phone AS "shippingPhone",
  o.shipping_address_line1 AS "shippingAddressLine1",
  o.shipping_address_line2 AS "shippingAddressLine2",
  o.shipping_city AS "shippingCity",
  o.shipping_state AS "shippingState",
  o.shipping_postal_code AS "shippingPostalCode",
  o.created_at AS "createdAt",
  o.updated_at AS "updatedAt",
  u.name AS "userName",
  u.email AS "userEmail"
`;

const normalizeExecutor = (executor) =>
  typeof executor === 'function' ? { query: executor } : executor;

const attachOrderItems = async (executor, orders) => {
  if (orders.length === 0) {
    return orders;
  }

  const db = normalizeExecutor(executor);
  const orderIds = orders.map((order) => order.id);
  const { rows } = await db.query(
    `
      SELECT
        oi.id,
        oi.order_id AS "orderId",
        oi.plant_id AS "plantId",
        oi.quantity,
        oi.price::float AS price,
        oi.plant_name_snapshot AS "plantName",
        oi.plant_image_url_snapshot AS "imageUrl",
        (oi.price * oi.quantity)::float AS subtotal
      FROM order_items oi
      WHERE oi.order_id = ANY($1::bigint[])
      ORDER BY oi.id ASC
    `,
    [orderIds]
  );

  const itemsByOrderId = rows.reduce((accumulator, item) => {
    const currentItems = accumulator.get(item.orderId) || [];
    currentItems.push(item);
    accumulator.set(item.orderId, currentItems);
    return accumulator;
  }, new Map());

  return orders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) || []
  }));
};

export const createOrderFromCart = async (userId, shippingPayload) =>
  withTransaction(async (client) => {
    const cart = await ensureCart(client, userId);
    const cartItemsResult = await client.query(
      `
        SELECT
          ci.id,
          ci.quantity,
          p.id AS "plantId",
          p.name AS "plantName",
          p.image_url AS "imageUrl",
          p.price::float AS price,
          p.stock,
          p.is_active AS "isActive"
        FROM cart_items ci
        JOIN plants p ON p.id = ci.plant_id
        WHERE ci.cart_id = $1
        ORDER BY ci.id ASC
        FOR UPDATE
      `,
      [cart.id]
    );
    const cartItems = cartItemsResult.rows;

    if (cartItems.length === 0) {
      throw new ApiError(400, 'Your cart is empty.');
    }

    for (const item of cartItems) {
      if (!item.isActive) {
        throw new ApiError(400, `${item.plantName} is no longer available.`);
      }

      if (item.quantity > item.stock) {
        throw new ApiError(400, `${item.plantName} does not have enough stock.`);
      }
    }

    const totalPrice = Number(
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    const orderResult = await client.query(
      `
        INSERT INTO orders (
          user_id,
          total_price,
          status,
          shipping_name,
          shipping_email,
          shipping_phone,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_postal_code
        )
        VALUES ($1, $2, 'PENDING', $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
      [
        userId,
        totalPrice,
        shippingPayload.shippingName,
        shippingPayload.shippingEmail,
        shippingPayload.shippingPhone,
        shippingPayload.shippingAddressLine1,
        shippingPayload.shippingAddressLine2,
        shippingPayload.shippingCity,
        shippingPayload.shippingState,
        shippingPayload.shippingPostalCode
      ]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of cartItems) {
      await client.query(
        `
          INSERT INTO order_items (
            order_id,
            plant_id,
            quantity,
            price,
            plant_name_snapshot,
            plant_image_url_snapshot
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [orderId, item.plantId, item.quantity, item.price, item.plantName, item.imageUrl]
      );

      await client.query(
        `
          UPDATE plants
          SET stock = stock - $1, updated_at = NOW()
          WHERE id = $2
        `,
        [item.quantity, item.plantId]
      );
    }

    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);

    const order = await getOrderById(orderId, userId, client);
    return order;
  });

export const getOrderById = async (orderId, viewerUserId = null, executor = query) => {
  const db = normalizeExecutor(executor);
  const params = [orderId];
  let ownershipClause = '';

  if (viewerUserId) {
    params.push(viewerUserId);
    ownershipClause = `AND o.user_id = $${params.length}`;
  }

  const orderResult = await db.query(
    `
      SELECT ${orderSelect}
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = $1
      ${ownershipClause}
      LIMIT 1
    `,
    params
  );
  const order = orderResult.rows[0];

  if (!order) {
    return null;
  }

  const [withItems] = await attachOrderItems(db, [order]);
  return withItems;
};

export const listOrdersByUser = async (executor, userId, filters = {}) => {
  const pagination = getPagination(filters.page, filters.limit);
  const [countResult, ordersResult] = await Promise.all([
    executor.query('SELECT COUNT(*)::int AS total FROM orders WHERE user_id = $1', [userId]),
    executor.query(
      `
        SELECT ${orderSelect}
        FROM orders o
        JOIN users u ON u.id = o.user_id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
        LIMIT $2 OFFSET $3
      `,
      [userId, pagination.limit, pagination.offset]
    )
  ]);

  const orders = await attachOrderItems(executor, ordersResult.rows);

  return buildPaginatedResponse({
    items: orders,
    page: pagination.page,
    limit: pagination.limit,
    totalItems: countResult.rows[0].total
  });
};

export const listAllOrders = async (executor, filters = {}) => {
  const pagination = getPagination(filters.page, filters.limit);
  const conditions = [];
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`o.status = $${params.length}`);
  }

  if (filters.q) {
    params.push(`%${filters.q}%`);
    conditions.push(
      `(u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR CAST(o.id AS TEXT) ILIKE $${params.length})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult, ordersResult] = await Promise.all([
    executor.query(
      `
        SELECT COUNT(*)::int AS total
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ${whereClause}
      `,
      params
    ),
    executor.query(
      `
        SELECT ${orderSelect}
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, pagination.limit, pagination.offset]
    )
  ]);

  const orders = await attachOrderItems(executor, ordersResult.rows);

  return buildPaginatedResponse({
    items: orders,
    page: pagination.page,
    limit: pagination.limit,
    totalItems: countResult.rows[0].total
  });
};

export const updateOrderStatus = async (executor, orderId, status) => {
  const result = await executor.query(
    `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id
    `,
    [status, orderId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return getOrderById(orderId, null, executor);
};

export const getAnalytics = async (executor) => {
  const [ordersSummary, userCount, plantCount, topPlants, recentOrdersBase] = await Promise.all([
    executor.query(
      `
        SELECT
          COALESCE(SUM(total_price), 0)::float AS revenue,
          COUNT(*)::int AS "orderCount",
          COUNT(*) FILTER (WHERE status = 'PENDING')::int AS "pendingOrders"
        FROM orders
      `
    ),
    executor.query('SELECT COUNT(*)::int AS total FROM users'),
    executor.query('SELECT COUNT(*)::int AS total FROM plants WHERE is_active = TRUE'),
    executor.query(
      `
        SELECT
          plant_id AS "plantId",
          plant_name_snapshot AS name,
          SUM(quantity)::int AS "unitsSold",
          SUM(price * quantity)::float AS revenue
        FROM order_items
        GROUP BY plant_id, plant_name_snapshot
        ORDER BY "unitsSold" DESC, revenue DESC
        LIMIT 5
      `
    ),
    executor.query(
      `
        SELECT ${orderSelect}
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 5
      `
    )
  ]);

  const recentOrders = await attachOrderItems(executor, recentOrdersBase.rows);

  return {
    totals: {
      revenue: ordersSummary.rows[0].revenue,
      orderCount: ordersSummary.rows[0].orderCount,
      pendingOrders: ordersSummary.rows[0].pendingOrders,
      userCount: userCount.rows[0].total,
      plantCount: plantCount.rows[0].total
    },
    topPlants: topPlants.rows,
    recentOrders
  };
};
