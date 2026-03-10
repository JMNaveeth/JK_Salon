import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite Database
const db = new Database("jksalon.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    status TEXT DEFAULT 'Active',
    description TEXT,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    serviceName TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    paymentStatus TEXT DEFAULT 'Pending',
    amount INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    approved BOOLEAN DEFAULT 0,
    photoUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'Unread',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as any;
if (serviceCount.count === 0) {
  const insertService = db.prepare("INSERT INTO services (id, name, category, price, duration, status) VALUES (?, ?, ?, ?, ?, ?)");
  insertService.run('1', 'Classic Haircut', 'Hair', 2500, 45, 'Active');
  insertService.run('2', 'Beard Sculpting', 'Beard', 1500, 30, 'Active');
  insertService.run('3', 'Hair Coloring', 'Hair', 5000, 90, 'Active');
  insertService.run('4', 'Luxury Facial', 'Facial', 3500, 60, 'Inactive');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "JK Salon API is running with SQLite" });
  });

  // Messages
  app.get("/api/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY createdAt DESC").all();
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { name, email, subject, message } = req.body;
    const id = Math.random().toString(36).substring(7);
    db.prepare("INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)")
      .run(id, name, email, subject, message);
    res.json({ success: true, id });
  });

  // Services API
  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services").all();
    res.json(services);
  });

  // Bookings API
  app.get("/api/bookings", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings ORDER BY createdAt DESC").all();
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { customerName, customerEmail, customerPhone, serviceName, date, time, amount } = req.body;
    const id = Math.random().toString(36).substring(7).toUpperCase();
    const insert = db.prepare("INSERT INTO bookings (id, customerName, customerEmail, customerPhone, serviceName, date, time, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    insert.run(id, customerName, customerEmail, customerPhone, serviceName, date, time, amount);
    res.json({ success: true, id });
  });

  // Reviews API
  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews").all();
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { customerName, rating, comment, date, photoUrl } = req.body;
    const id = Math.random().toString(36).substring(7).toUpperCase();
    const insert = db.prepare("INSERT INTO reviews (id, customerName, rating, comment, date, approved, photoUrl) VALUES (?, ?, ?, ?, ?, 0, ?)");
    insert.run(id, customerName, rating, comment, date, photoUrl);
    res.json({ success: true, id });
  });

  app.patch("/api/reviews/:id/approve", (req, res) => {
    const { id } = req.params;
    const update = db.prepare("UPDATE reviews SET approved = 1 WHERE id = ?");
    update.run(id);
    res.json({ success: true });
  });

  // Gallery API
  app.get("/api/gallery", (req, res) => {
    const gallery = db.prepare("SELECT * FROM gallery").all();
    res.json(gallery);
  });

  app.post("/api/gallery", (req, res) => {
    const { url, type, category } = req.body;
    const id = Math.random().toString(36).substring(7).toUpperCase();
    const insert = db.prepare("INSERT INTO gallery (id, url, type, category) VALUES (?, ?, ?, ?)");
    insert.run(id, url, type, category);
    res.json({ success: true, id });
  });

  // Payment Simulation Endpoint
  app.post("/api/payments/simulate", (req, res) => {
    const { amount, bookingId } = req.body;
    console.log(`Simulating payment for booking ${bookingId} with amount ${amount}`);
    
    // Update booking status in DB
    const update = db.prepare("UPDATE bookings SET paymentStatus = 'Paid', status = 'Confirmed' WHERE id = ?");
    update.run(bookingId);

    setTimeout(() => {
      res.json({ 
        success: true, 
        transactionId: `TXN_${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: 'paid'
      });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
