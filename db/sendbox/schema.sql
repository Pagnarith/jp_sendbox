-- jp_sendbox: Mock Dataverse tables mirroring cr1f8_* structure
-- Uses better-sqlite3 for local testing without Azure/Dataverse

CREATE TABLE IF NOT EXISTS cr1f8_contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  telegramId TEXT,
  location TEXT DEFAULT 'BTB',
  notes TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cr1f8_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price REAL DEFAULT 0,
  imageUrl TEXT,
  sku TEXT,
  contactId TEXT REFERENCES cr1f8_contacts(id),
  status INTEGER DEFAULT 100000000,
  boughtAt TEXT,
  returnedAt TEXT,
  returnedPrice REAL,
  isOld INTEGER DEFAULT 0,
  sellerShares TEXT,
  saleName TEXT,
  invoiceNumber TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cr1f8_orders (
  id TEXT PRIMARY KEY,
  contactId TEXT REFERENCES cr1f8_contacts(id),
  productId TEXT REFERENCES cr1f8_products(id),
  status TEXT,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  orderDate TEXT,
  pickUpDate TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sendbox_health_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  state TEXT NOT NULL DEFAULT 'healthy',
  version TEXT DEFAULT '1.0.91',
  preferCloud INTEGER DEFAULT 0,
  updating INTEGER DEFAULT 0,
  simulateLatencyMs INTEGER DEFAULT 0,
  updatedAt TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO sendbox_health_state (id, state) VALUES (1, 'healthy');

CREATE TABLE IF NOT EXISTS sendbox_app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_status ON cr1f8_products(status);
CREATE INDEX IF NOT EXISTS idx_products_bought_at ON cr1f8_products(boughtAt);
CREATE INDEX IF NOT EXISTS idx_products_sale_name ON cr1f8_products(saleName);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON cr1f8_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_telegram ON cr1f8_contacts(telegramId);