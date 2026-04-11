INSERT INTO users (id, name, email, password_hash, role)
VALUES
  (
    1,
    'Admin User',
    'admin@nursery.com',
    'scrypt$16384$8$1$nursery-admin-salt$8a9b0914f9b34432ddc1b66957d57eccbd57a60699310e5a05c2f0fc2a997a7a0ae551c3345ab69a685618c41075ca9f39e10f8256e376828e2b2691a1d11e1c',
    'ADMIN'
  ),
  (
    2,
    'Maya Green',
    'user@nursery.com',
    'scrypt$16384$8$1$nursery-user-salt$aee13f9c9a5fc0b23ee57c7019ec47fa9925374f756365758e4a80d95f22dff1438ab6942fc79ca0b4c1d718763c860e89301623c1b21dd9d7fd8a4091d10b7f',
    'USER'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO carts (id, user_id)
VALUES
  (1, 1),
  (2, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wishlists (id, user_id)
VALUES
  (1, 1),
  (2, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, name, slug, description, image_url, category, price, stock, is_active)
VALUES
  (
    1,
    'Areca Palm',
    'areca-palm',
    'A lush air-purifying indoor palm that brightens living rooms and workspaces.',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
    'Indoor',
    499.00,
    18,
    TRUE
  ),
  (
    2,
    'Snake Plant',
    'snake-plant',
    'Low-maintenance upright foliage plant, ideal for bedrooms and low-light corners.',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
    'Indoor',
    349.00,
    25,
    TRUE
  ),
  (
    3,
    'Tulsi',
    'tulsi',
    'Sacred basil with medicinal value, suited for balconies and sunny windows.',
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
    'Medicinal',
    199.00,
    30,
    TRUE
  ),
  (
    4,
    'Monstera Deliciosa',
    'monstera-deliciosa',
    'Statement foliage with iconic split leaves for premium indoor decor.',
    'https://images.unsplash.com/photo-1463154545680-d59320fd685d?auto=format&fit=crop&w=1200&q=80',
    'Indoor',
    800.00,
    10,
    TRUE
  ),
  (
    5,
    'Rosemary Bush',
    'rosemary-bush',
    'Fragrant culinary herb that thrives in bright patios and kitchen gardens.',
    'https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=1200&q=80',
    'Outdoor',
    279.00,
    20,
    TRUE
  ),
  (
    6,
    'Peace Lily',
    'peace-lily',
    'Elegant flowering indoor plant that prefers filtered light and regular watering.',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    'Indoor',
    450.00,
    12,
    TRUE
  ),
  (
    7,
    'Lavender',
    'lavender',
    'Aromatic flowering herb with calming fragrance for patios and sunlit spaces.',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
    'Outdoor',
    320.00,
    14,
    TRUE
  ),
  (
    8,
    'Aloe Vera',
    'aloe-vera',
    'Succulent medicinal plant known for soothing gel and easy care.',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    'Medicinal',
    229.00,
    0,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (id, cart_id, plant_id, quantity)
VALUES
  (1, 2, 2, 1),
  (2, 2, 5, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wishlist_items (id, wishlist_id, plant_id)
VALUES
  (1, 2, 3),
  (2, 2, 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (
  id,
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
  shipping_postal_code,
  created_at,
  updated_at
)
VALUES
  (
    1,
    2,
    1299.00,
    'DELIVERED',
    'Maya Green',
    'user@nursery.com',
    '+91-9876543210',
    '42 Green Avenue',
    'Near Cedar Park',
    'Dehradun',
    'Uttarakhand',
    '248001',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (
  id,
  order_id,
  plant_id,
  quantity,
  price,
  plant_name_snapshot,
  plant_image_url_snapshot
)
VALUES
  (
    1,
    1,
    1,
    1,
    499.00,
    'Areca Palm',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    2,
    1,
    4,
    1,
    800.00,
    'Monstera Deliciosa',
    'https://images.unsplash.com/photo-1463154545680-d59320fd685d?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('carts', 'id'), COALESCE(MAX(id), 1)) FROM carts;
SELECT setval(pg_get_serial_sequence('wishlists', 'id'), COALESCE(MAX(id), 1)) FROM wishlists;
SELECT setval(pg_get_serial_sequence('plants', 'id'), COALESCE(MAX(id), 1)) FROM plants;
SELECT setval(pg_get_serial_sequence('cart_items', 'id'), COALESCE(MAX(id), 1)) FROM cart_items;
SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE(MAX(id), 1)) FROM orders;
SELECT setval(pg_get_serial_sequence('order_items', 'id'), COALESCE(MAX(id), 1)) FROM order_items;
SELECT setval(pg_get_serial_sequence('wishlist_items', 'id'), COALESCE(MAX(id), 1)) FROM wishlist_items;
