/**
 * Sendbox in-memory SQLite store — replaces Dataverse Web API for local testing.
 * Mirrors cr1f8_* table structure so the same query shapes work.
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "db/sendbox");
const DB_PATH = path.join(DB_DIR, "sendbox.db");
const SCHEMA_PATH = path.join(DB_DIR, "schema.sql");

let _db: Database.Database | null = null;

export function getSendboxDb(): Database.Database {
  if (_db) return _db;
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  // Initialize schema if tables don't exist
  if (fs.existsSync(SCHEMA_PATH)) {
    const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
    _db.exec(schema);
  }
  return _db;
}

export function closeSendboxDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export interface SendboxContact {
  id: string;
  name: string;
  phone: string | null;
  telegramId: string | null;
  location: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function listContacts(): SendboxContact[] {
  const db = getSendboxDb();
  return db.prepare("SELECT * FROM cr1f8_contacts ORDER BY name").all() as SendboxContact[];
}

export function findContactByPhone(phone: string): SendboxContact | undefined {
  const db = getSendboxDb();
  return db.prepare("SELECT * FROM cr1f8_contacts WHERE phone = ?").get(phone) as SendboxContact | undefined;
}

export function findContactByName(name: string): SendboxContact | undefined {
  const db = getSendboxDb();
  return db.prepare("SELECT * FROM cr1f8_contacts WHERE name = ?").get(name) as SendboxContact | undefined;
}

export function createContact(contact: Omit<SendboxContact, "createdAt" | "updatedAt">): SendboxContact {
  const db = getSendboxDb();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO cr1f8_contacts (id, name, phone, telegramId, location, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(contact.id, contact.name, contact.phone, contact.telegramId, contact.location, contact.notes, now, now);
  return { ...contact, createdAt: now, updatedAt: now };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface SendboxProduct {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sku: string | null;
  contactId: string | null;
  status: number;
  boughtAt: string | null;
  returnedAt: string | null;
  returnedPrice: number | null;
  isOld: number;
  sellerShares: string | null;
  saleName: string | null;
  invoiceNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export function listProducts(status?: number): SendboxProduct[] {
  const db = getSendboxDb();
  if (status !== undefined) {
    return db.prepare("SELECT * FROM cr1f8_products WHERE status = ? ORDER BY createdAt DESC").all(status) as SendboxProduct[];
  }
  return db.prepare("SELECT * FROM cr1f8_products ORDER BY createdAt DESC").all() as SendboxProduct[];
}

export function createProduct(product: Omit<SendboxProduct, "createdAt" | "updatedAt">): SendboxProduct {
  const db = getSendboxDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO cr1f8_products (id, name, category, description, price, imageUrl, sku, contactId, status, boughtAt, returnedAt, returnedPrice, isOld, sellerShares, saleName, invoiceNumber, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    product.id, product.name, product.category, product.description, product.price,
    product.imageUrl, product.sku, product.contactId, product.status, product.boughtAt,
    product.returnedAt, product.returnedPrice, product.isOld, product.sellerShares,
    product.saleName, product.invoiceNumber, now, now
  );
  return { ...product, createdAt: now, updatedAt: now };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface SendboxOrder {
  id: string;
  contactId: string | null;
  productId: string | null;
  status: string | null;
  quantity: number;
  notes: string | null;
  orderDate: string | null;
  pickUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function listOrders(): SendboxOrder[] {
  const db = getSendboxDb();
  return db.prepare("SELECT * FROM cr1f8_orders ORDER BY createdAt DESC").all() as SendboxOrder[];
}

export function createOrder(order: Omit<SendboxOrder, "createdAt" | "updatedAt">): SendboxOrder {
  const db = getSendboxDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO cr1f8_orders (id, contactId, productId, status, quantity, notes, orderDate, pickUpDate, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(order.id, order.contactId, order.productId, order.status, order.quantity, order.notes, order.orderDate, order.pickUpDate, now, now);
  return { ...order, createdAt: now, updatedAt: now };
}

// ---------------------------------------------------------------------------
// Health State (for failover simulation)
// ---------------------------------------------------------------------------

export interface SendboxHealthState {
  state: string;
  version: string;
  preferCloud: boolean;
  updating: boolean;
  simulateLatencyMs: number;
}

export function getHealthState(): SendboxHealthState {
  const db = getSendboxDb();
  const row = db.prepare("SELECT * FROM sendbox_health_state WHERE id = 1").get() as Record<string, unknown> | undefined;
  if (!row) return { state: "healthy", version: "1.0.91", preferCloud: false, updating: false, simulateLatencyMs: 0 };
  return {
    state: String(row.state),
    version: String(row.version ?? "1.0.91"),
    preferCloud: Boolean(row.preferCloud),
    updating: Boolean(row.updating),
    simulateLatencyMs: Number(row.simulateLatencyMs ?? 0),
  };
}