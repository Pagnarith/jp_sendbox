/**
 * Seed jp_sendbox with test data for failover testing.
 * Run: npx tsx scripts/sendbox/seed-all.ts
 */
import { getSendboxDb, closeSendboxDb } from "@/platform/dataverse/sendbox-store";

function seed() {
  const db = getSendboxDb();

  // Clear existing data
  db.exec(`
    DELETE FROM cr1f8_orders;
    DELETE FROM cr1f8_products;
    DELETE FROM cr1f8_contacts;
  `);

  // Seed contacts
  const contacts = [
    { id: "c001", name: "Ms. Srey Mom", phone: "092-123-456", telegramId: "900000003", location: "BTB" },
    { id: "c002", name: "Ms. Chantha", phone: "097-654-321", telegramId: null, location: "PP" },
    { id: "c003", name: "Mr. Vichea", phone: "081-111-222", telegramId: null, location: "SR" },
    { id: "c004", name: "Ms. Bopha", phone: "096-333-444", telegramId: null, location: "BTB" },
    { id: "c005", name: "Ms. Kunthea", phone: "089-555-666", telegramId: null, location: "PP" },
  ];

  const insertContact = db.prepare(
    "INSERT INTO cr1f8_contacts (id, name, phone, telegramId, location, notes) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const c of contacts) {
    insertContact.run(c.id, c.name, c.phone, c.telegramId, c.location, null);
  }

  // Seed products (mix of statuses)
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();

  const products = [
    // Bought products
    { id: "p001", name: "Gold Ring 18K", category: "Ring", price: 850, status: 100000001, boughtAt: now, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000001", contactId: "c001" },
    { id: "p002", name: "Diamond Necklace", category: "Necklace", price: 2400, status: 100000001, boughtAt: now, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000002", contactId: "c002" },
    { id: "p003", name: "Silver Bracelet", category: "Bracelet", price: 320, status: 100000001, boughtAt: yesterday, saleName: "Test Seller One", invoiceNumber: "2SIN260000003", contactId: "c003" },
    { id: "p004", name: "Gold Earrings", category: "Earring", price: 680, status: 100000001, boughtAt: yesterday, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000004", contactId: "c004" },
    { id: "p005", name: "Platinum Ring", category: "Ring", price: 1500, status: 100000001, boughtAt: lastWeek, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000005", contactId: "c005" },
    // Ordering products
    { id: "p006", name: "Ruby Pendant", category: "Pendant", price: 950, status: 100000000, boughtAt: null, saleName: "Sreypich Chan", invoiceNumber: null, contactId: "c001" },
    { id: "p007", name: "Jade Bangle", category: "Bangle", price: 420, status: 100000000, boughtAt: null, saleName: "Test Seller One", invoiceNumber: null, contactId: "c002" },
    // Returned product
    { id: "p008", name: "Gold Chain", category: "Chain", price: 780, status: 100000002, boughtAt: lastWeek, returnedAt: now, returnedPrice: 750, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000008", contactId: "c003" },
    // Unpaid product
    { id: "p009", name: "Emerald Ring", category: "Ring", price: 1200, status: 100000003, boughtAt: null, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000009", contactId: "c004" },
    // Changed product
    { id: "p010", name: "Pearl Set", category: "Set", price: 560, status: 100000004, boughtAt: lastWeek, returnedAt: yesterday, returnedPrice: 540, saleName: "Sreypich Chan", invoiceNumber: "2SIN260000010", contactId: "c005" },
  ];

  const insertProduct = db.prepare(
    `INSERT INTO cr1f8_products (id, name, category, description, price, imageUrl, sku, contactId, status, boughtAt, returnedAt, returnedPrice, isOld, sellerShares, saleName, invoiceNumber)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  );
  for (const p of products) {
    insertProduct.run(
      p.id, p.name, p.category, null, p.price, null, null,
      p.contactId, p.status, p.boughtAt, p.returnedAt ?? null,
      p.returnedPrice ?? null, null, p.saleName, p.invoiceNumber
    );
  }

  // Seed orders
  const orders = [
    { id: "o001", contactId: "c001", productId: "p001", status: "completed", quantity: 1, orderDate: now },
    { id: "o002", contactId: "c002", productId: "p002", status: "completed", quantity: 1, orderDate: now },
    { id: "o003", contactId: "c003", productId: "p003", status: "pending", quantity: 2, orderDate: yesterday },
  ];

  const insertOrder = db.prepare(
    `INSERT INTO cr1f8_orders (id, contactId, productId, status, quantity, notes, orderDate, pickUpDate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const o of orders) {
    insertOrder.run(o.id, o.contactId, o.productId, o.status, o.quantity, null, o.orderDate, null);
  }

  console.log(`Seeded: ${contacts.length} contacts, ${products.length} products, ${orders.length} orders`);
  closeSendboxDb();
}

seed();