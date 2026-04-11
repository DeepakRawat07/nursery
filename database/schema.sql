CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pending_registrations (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  password_hash TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE plants (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  plant_id BIGINT NOT NULL REFERENCES plants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_items_unique_cart_plant UNIQUE (cart_id, plant_id)
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  status order_status NOT NULL DEFAULT 'PENDING',
  shipping_name VARCHAR(120) NOT NULL,
  shipping_email VARCHAR(255) NOT NULL,
  shipping_phone VARCHAR(40) NOT NULL,
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(120) NOT NULL,
  shipping_state VARCHAR(120) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plant_id BIGINT NOT NULL REFERENCES plants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  plant_name_snapshot VARCHAR(180) NOT NULL,
  plant_image_url_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  wishlist_id BIGINT NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  plant_id BIGINT NOT NULL REFERENCES plants(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT wishlist_items_unique_wishlist_plant UNIQUE (wishlist_id, plant_id)
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_pending_registrations_expires_at ON pending_registrations(expires_at);
CREATE INDEX idx_plants_category ON plants(category);
CREATE INDEX idx_plants_price ON plants(price);
CREATE INDEX idx_plants_stock ON plants(stock);
CREATE INDEX idx_plants_active_created ON plants(is_active, created_at DESC);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_plant_id ON cart_items(plant_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_plant_id ON order_items(plant_id);
CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_plant_id ON wishlist_items(plant_id);
