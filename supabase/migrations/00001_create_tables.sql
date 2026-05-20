-- ============================================================
-- Supabase Migration: Create all tables
-- Project: claude-test-project1 (Shopping Mall Admin)
-- ============================================================

-- 1. Utility: updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Core Tables
-- ============================================================

-- 2-1. customers
CREATE TABLE customers (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL UNIQUE,
  total_orders INTEGER     NOT NULL DEFAULT 0,
  total_spent  INTEGER     NOT NULL DEFAULT 0,
  grade        TEXT        NOT NULL DEFAULT 'normal',
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_customers_grade
    CHECK (grade IN ('normal', 'vip', 'vvip')),
  CONSTRAINT chk_customers_total_orders_non_negative
    CHECK (total_orders >= 0),
  CONSTRAINT chk_customers_total_spent_non_negative
    CHECK (total_spent >= 0)
);

CREATE INDEX idx_customers_grade ON customers (grade);
CREATE INDEX idx_customers_joined_at ON customers (joined_at DESC);
CREATE INDEX idx_customers_total_spent ON customers (total_spent DESC);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 2-2. products
CREATE TABLE products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  price       INTEGER     NOT NULL,
  stock       INTEGER     NOT NULL DEFAULT 0,
  status      TEXT        NOT NULL DEFAULT 'draft',
  image       TEXT        NOT NULL DEFAULT '',
  description TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_products_category
    CHECK (category IN ('의류', '전자기기', '식품', '생활용품', '기타')),
  CONSTRAINT chk_products_status
    CHECK (status IN ('active', 'draft', 'soldout')),
  CONSTRAINT chk_products_price_non_negative
    CHECK (price >= 0),
  CONSTRAINT chk_products_stock_non_negative
    CHECK (stock >= 0)
);

CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_stock ON products (stock);
CREATE INDEX idx_products_created_at ON products (created_at DESC);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2-3. orders
CREATE TABLE orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID        NOT NULL,
  customer_name   TEXT        NOT NULL,
  total_amount    INTEGER     NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'pending',
  ordered_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  address         TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  tracking_number TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers (id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_orders_status
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT chk_orders_total_amount_non_negative
    CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_ordered_at ON orders (ordered_at DESC);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_status_ordered_at ON orders (status, ordered_at DESC);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2-4. order_items
CREATE TABLE order_items (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID    NOT NULL,
  product_id UUID    NOT NULL,
  name       TEXT    NOT NULL,
  quantity   INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_order_items_quantity_positive
    CHECK (quantity > 0),
  CONSTRAINT chk_order_items_unit_price_non_negative
    CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

CREATE TRIGGER trg_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2-5. notifications
CREATE TABLE notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT        NOT NULL,
  title      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  order_id   UUID        NOT NULL,
  is_read    BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_notifications_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE,

  CONSTRAINT chk_notifications_type
    CHECK (type IN ('new_order', 'order_status', 'order_cancelled'))
);

CREATE INDEX idx_notifications_is_read_created_at ON notifications (is_read, created_at DESC);
CREATE INDEX idx_notifications_order_id ON notifications (order_id);

CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Analytics Aggregation Tables
-- ============================================================

-- 3-1. daily_sales
CREATE TABLE daily_sales (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE    NOT NULL UNIQUE,
  total_sales INTEGER NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_daily_sales_non_negative
    CHECK (total_sales >= 0 AND order_count >= 0)
);

CREATE INDEX idx_daily_sales_date ON daily_sales (date DESC);

CREATE TRIGGER trg_daily_sales_updated_at
  BEFORE UPDATE ON daily_sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE daily_sales ENABLE ROW LEVEL SECURITY;

-- 3-2. bestsellers
CREATE TABLE bestsellers (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  period       TEXT    NOT NULL,
  product_id   UUID    NOT NULL,
  product_name TEXT    NOT NULL,
  sales_count  INTEGER NOT NULL DEFAULT 0,
  rank         INTEGER NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_bestsellers_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE,

  CONSTRAINT chk_bestsellers_rank_positive
    CHECK (rank > 0),
  CONSTRAINT chk_bestsellers_sales_count_non_negative
    CHECK (sales_count >= 0),

  CONSTRAINT uq_bestsellers_period_rank UNIQUE (period, rank)
);

CREATE INDEX idx_bestsellers_period ON bestsellers (period);

CREATE TRIGGER trg_bestsellers_updated_at
  BEFORE UPDATE ON bestsellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE bestsellers ENABLE ROW LEVEL SECURITY;

-- 3-3. regional_sales
CREATE TABLE regional_sales (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  period       TEXT    NOT NULL,
  region       TEXT    NOT NULL,
  sales_amount INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_regional_sales_non_negative
    CHECK (sales_amount >= 0),

  CONSTRAINT uq_regional_sales_period_region UNIQUE (period, region)
);

CREATE INDEX idx_regional_sales_period ON regional_sales (period);

CREATE TRIGGER trg_regional_sales_updated_at
  BEFORE UPDATE ON regional_sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE regional_sales ENABLE ROW LEVEL SECURITY;

-- 3-4. analytics_kpi
CREATE TABLE analytics_kpi (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  period          TEXT        NOT NULL UNIQUE,
  revenue         INTEGER     NOT NULL DEFAULT 0,
  orders          INTEGER     NOT NULL DEFAULT 0,
  avg_order_value INTEGER     NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_analytics_kpi_non_negative
    CHECK (revenue >= 0 AND orders >= 0 AND avg_order_value >= 0),
  CONSTRAINT chk_analytics_kpi_conversion_rate_range
    CHECK (conversion_rate >= 0 AND conversion_rate <= 100)
);

CREATE INDEX idx_analytics_kpi_period ON analytics_kpi (period);

CREATE TRIGGER trg_analytics_kpi_updated_at
  BEFORE UPDATE ON analytics_kpi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE analytics_kpi ENABLE ROW LEVEL SECURITY;
