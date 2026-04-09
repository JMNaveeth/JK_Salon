import dotenv from 'dotenv';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import Database from 'better-sqlite3';
import multer from 'multer';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbEvents = new EventEmitter();

const randomId = () => Math.random().toString(36).substring(2, 9).toUpperCase();
const randomSCode = () => `S-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
const toMillis = (value: any) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
};

const normalizeDoc = (doc: any) => {
  const data = doc.data ? doc.data() : doc;
  const normalized: Record<string, any> = { id: doc.id || data.id, ...data };
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (value && typeof value.toDate === 'function') {
      normalized[key] = value.toDate().toISOString();
    }
  });
  return normalized;
};

const initFirestore = () => {
  try {
    if (getApps().length) return getFirestore();

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (serviceAccountRaw) {
      const serviceAccount = JSON.parse(serviceAccountRaw);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: projectId || serviceAccount.project_id,
        storageBucket,
      });
      return getFirestore();
    }

    if (projectId || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      initializeApp({ credential: applicationDefault(), projectId, storageBucket });
      return getFirestore();
    }

    return null;
  } catch (error) {
    console.error('[BACKEND] Firestore init failed, using SQLite fallback:', error);
    return null;
  }
};

const firestore = initFirestore();
const usingFirestore = !!firestore;
const cloudStorage = getApps().length ? getStorage() : null;
const usingCloudStorage = !!cloudStorage && !!process.env.FIREBASE_STORAGE_BUCKET;

const sqlitePath = process.env.SQLITE_PATH || path.resolve(__dirname, 'jksalon.db');
const sqliteDb = new Database(sqlitePath);

sqliteDb.exec(`
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
    sCode TEXT UNIQUE,
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

try {
  const bookingColumns = sqliteDb.prepare("PRAGMA table_info(bookings)").all() as Array<{ name: string }>;
  if (!bookingColumns.some((column) => column.name === 'sCode')) {
    sqliteDb.prepare('ALTER TABLE bookings ADD COLUMN sCode TEXT').run();
  }
  sqliteDb.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_sCode ON bookings(sCode)').run();
} catch (error) {
  console.error('[BACKEND] Failed to ensure bookings.sCode column exists:', error);
}

const createUniqueSCode = async () => {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = randomSCode();

    if (usingFirestore && firestore) {
      const snap = await firestore.collection('bookings').where('sCode', '==', candidate).limit(1).get();
      if (snap.empty) return candidate;
      continue;
    }

    const existing = sqliteDb.prepare('SELECT id FROM bookings WHERE sCode = ? LIMIT 1').get(candidate);
    if (!existing) return candidate;
  }

  return `S-${Date.now().toString(36).toUpperCase()}`;
};

const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  app.use('/uploads', express.static(uploadsDir));

  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      cb(null, name);
    },
  });

  const upload = multer({
    storage: usingCloudStorage ? multer.memoryStorage() : diskStorage,
    fileFilter: (_req, file, cb) => {
      const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.webm', '.m4v'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) return cb(null, true);
      cb(new Error(`Format ${ext} not supported`));
    },
    limits: { fileSize: 200 * 1024 * 1024 },
  });

  app.post('/api/upload', (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, error: err.message });
      if (!req.file) return res.status(400).json({ success: false, error: 'No file received' });

      try {
        if (usingCloudStorage && cloudStorage && req.file.buffer) {
          const bucket = cloudStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
          const ext = path.extname(req.file.originalname).toLowerCase();
          const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
          const file = bucket.file(fileName);

          await file.save(req.file.buffer, {
            resumable: false,
            metadata: {
              contentType: req.file.mimetype,
            },
          });

          await file.makePublic();
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          return res.json({ success: true, imageUrl });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        return res.json({ success: true, imageUrl });
      } catch (uploadError: any) {
        return res.status(500).json({ success: false, error: uploadError.message || 'Upload failed' });
      }
    });
  });

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      database: usingFirestore ? 'firestore' : 'sqlite',
      message: 'JK Salon API is running',
    });
  });

  app.get('/api/services/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write('data: connected\n\n');

    const listener = () => {
      res.write('data: updated\n\n');
    };

    dbEvents.on('services_updated', listener);
    req.on('close', () => dbEvents.off('services_updated', listener));
  });

  app.get('/api/gallery/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write('data: connected\n\n');

    const listener = () => {
      res.write('data: updated\n\n');
    };

    dbEvents.on('gallery_updated', listener);
    req.on('close', () => dbEvents.off('gallery_updated', listener));
  });

  // Messages
  app.get('/api/messages', asyncHandler(async (_req, res) => {
    if (usingFirestore && firestore) {
      const snap = await firestore.collection('messages').get();
      const messages = snap.docs.map(normalizeDoc).sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      return res.json(messages);
    }

    const messages = sqliteDb.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
    return res.json(messages);
  }));

  app.post('/api/messages', asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    const id = randomId();

    if (usingFirestore && firestore) {
      await firestore.collection('messages').doc(id).set({
        id,
        name,
        email,
        subject: subject || '',
        message: message || '',
        status: 'Unread',
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.json({ success: true, id });
    }

    sqliteDb
      .prepare('INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email, subject, message);
    return res.json({ success: true, id });
  }));

  // Services
  app.get('/api/services', asyncHandler(async (_req, res) => {
    if (usingFirestore && firestore) {
      const snap = await firestore.collection('services').get();
      return res.json(snap.docs.map(normalizeDoc));
    }

    const services = sqliteDb.prepare('SELECT * FROM services').all();
    return res.json(services);
  }));

  app.post('/api/services', asyncHandler(async (req, res) => {
    const { name, category, price, duration, status, description, imageUrl } = req.body;
    const id = randomId();

    if (usingFirestore && firestore) {
      await firestore.collection('services').doc(id).set({
        id,
        name,
        category,
        price: Number(price || 0),
        duration: Number(duration || 0),
        status: status || 'Active',
        description: description || '',
        imageUrl: imageUrl || '',
        updatedAt: FieldValue.serverTimestamp(),
      });
      dbEvents.emit('services_updated');
      return res.json({ success: true, id });
    }

    sqliteDb
      .prepare('INSERT INTO services (id, name, category, price, duration, status, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, category, price, duration, status || 'Active', description || '', imageUrl || '');
    dbEvents.emit('services_updated');
    return res.json({ success: true, id });
  }));

  app.put('/api/services/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, price, duration, status, description, imageUrl } = req.body;

    if (usingFirestore && firestore) {
      await firestore.collection('services').doc(id).set({
        id,
        name,
        category,
        price: Number(price || 0),
        duration: Number(duration || 0),
        status,
        description: description || '',
        imageUrl: imageUrl || '',
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      dbEvents.emit('services_updated');
      return res.json({ success: true });
    }

    sqliteDb
      .prepare('UPDATE services SET name = ?, category = ?, price = ?, duration = ?, status = ?, description = ?, imageUrl = ? WHERE id = ?')
      .run(name, category, price, duration, status, description || '', imageUrl || '', id);
    dbEvents.emit('services_updated');
    return res.json({ success: true });
  }));

  app.delete('/api/services/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (usingFirestore && firestore) {
      await firestore.collection('services').doc(id).delete();
      dbEvents.emit('services_updated');
      return res.json({ success: true });
    }

    sqliteDb.prepare('DELETE FROM services WHERE id = ?').run(id);
    dbEvents.emit('services_updated');
    return res.json({ success: true });
  }));

  app.patch('/api/services/:id/toggle', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (usingFirestore && firestore) {
      const ref = firestore.collection('services').doc(id);
      const docSnap = await ref.get();
      const currentStatus = docSnap.exists ? docSnap.data()?.status : 'Active';
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await ref.set({ status: newStatus, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      dbEvents.emit('services_updated');
      return res.json({ success: true, status: newStatus });
    }

    const service = sqliteDb.prepare('SELECT status FROM services WHERE id = ?').get(id) as any;
    const newStatus = service?.status === 'Active' ? 'Inactive' : 'Active';
    sqliteDb.prepare('UPDATE services SET status = ? WHERE id = ?').run(newStatus, id);
    dbEvents.emit('services_updated');
    return res.json({ success: true, status: newStatus });
  }));

  // Bookings
  app.get('/api/bookings', asyncHandler(async (_req, res) => {
    if (usingFirestore && firestore) {
      const snap = await firestore.collection('bookings').get();
      const bookings = snap.docs.map(normalizeDoc).sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      return res.json(bookings);
    }

    const bookings = sqliteDb.prepare('SELECT * FROM bookings ORDER BY createdAt DESC').all();
    return res.json(bookings);
  }));

  app.post('/api/bookings', asyncHandler(async (req, res) => {
    const { customerName, customerEmail, customerPhone, serviceName, date, time, amount } = req.body;
    const id = randomId();
    const sCode = await createUniqueSCode();

    if (usingFirestore && firestore) {
      await firestore.collection('bookings').doc(id).set({
        id,
        sCode,
        customerName,
        customerEmail,
        customerPhone,
        serviceName,
        date,
        time,
        amount: Number(amount || 0),
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return res.json({ success: true, id, sCode });
    }

    sqliteDb
      .prepare('INSERT INTO bookings (id, customerName, customerEmail, customerPhone, serviceName, date, time, sCode, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, customerName, customerEmail, customerPhone, serviceName, date, time, sCode, amount);
    return res.json({ success: true, id, sCode });
  }));

  app.patch('/api/bookings/:id/status', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (usingFirestore && firestore) {
      await firestore.collection('bookings').doc(id).set({ status, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return res.json({ success: true });
    }

    sqliteDb.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    return res.json({ success: true });
  }));

  app.delete('/api/bookings/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (usingFirestore && firestore) {
      await firestore.collection('bookings').doc(id).delete();
      return res.json({ success: true });
    }

    sqliteDb.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    return res.json({ success: true });
  }));

  app.post('/api/payments/simulate', asyncHandler(async (req, res) => {
    const { amount, bookingId } = req.body;

    if (usingFirestore && firestore) {
      await firestore.collection('bookings').doc(bookingId).set({
        paymentStatus: 'Paid',
        status: 'Confirmed',
        amount: Number(amount || 0),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    } else {
      sqliteDb.prepare("UPDATE bookings SET paymentStatus = 'Paid', status = 'Confirmed' WHERE id = ?").run(bookingId);
    }

    setTimeout(() => {
      res.json({
        success: true,
        transactionId: `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: 'paid',
      });
    }, 600);
  }));

  // Reviews
  app.get('/api/reviews', asyncHandler(async (_req, res) => {
    if (usingFirestore && firestore) {
      const snap = await firestore.collection('reviews').get();
      return res.json(snap.docs.map(normalizeDoc));
    }

    const reviews = sqliteDb.prepare('SELECT * FROM reviews').all();
    return res.json(reviews);
  }));

  app.post('/api/reviews', asyncHandler(async (req, res) => {
    const { customerName, rating, comment, date, photoUrl } = req.body;
    const id = randomId();

    if (usingFirestore && firestore) {
      await firestore.collection('reviews').doc(id).set({
        id,
        customerName,
        rating: Number(rating || 0),
        comment,
        date,
        approved: false,
        photoUrl: photoUrl || '',
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.json({ success: true, id });
    }

    sqliteDb
      .prepare('INSERT INTO reviews (id, customerName, rating, comment, date, approved, photoUrl) VALUES (?, ?, ?, ?, ?, 0, ?)')
      .run(id, customerName, rating, comment, date, photoUrl);
    return res.json({ success: true, id });
  }));

  app.patch('/api/reviews/:id/approve', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (usingFirestore && firestore) {
      await firestore.collection('reviews').doc(id).set({ approved: true }, { merge: true });
      return res.json({ success: true });
    }

    sqliteDb.prepare('UPDATE reviews SET approved = 1 WHERE id = ?').run(id);
    return res.json({ success: true });
  }));

  // Gallery
  app.get('/api/gallery', asyncHandler(async (_req, res) => {
    if (usingFirestore && firestore) {
      const snap = await firestore.collection('gallery').get();
      return res.json(snap.docs.map(normalizeDoc));
    }

    const gallery = sqliteDb.prepare('SELECT * FROM gallery').all();
    return res.json(gallery);
  }));

  app.post('/api/gallery', asyncHandler(async (req, res) => {
    const { url, type, category } = req.body;
    const id = randomId();

    if (usingFirestore && firestore) {
      await firestore.collection('gallery').doc(id).set({
        id,
        url,
        type,
        category,
        createdAt: FieldValue.serverTimestamp(),
      });
      dbEvents.emit('gallery_updated');
      return res.json({ success: true, id });
    }

    sqliteDb.prepare('INSERT INTO gallery (id, url, type, category) VALUES (?, ?, ?, ?)').run(id, url, type, category);
    dbEvents.emit('gallery_updated');
    return res.json({ success: true, id });
  }));

  app.delete('/api/gallery/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (usingFirestore && firestore) {
      await firestore.collection('gallery').doc(id).delete();
      dbEvents.emit('gallery_updated');
      return res.json({ success: true });
    }

    sqliteDb.prepare('DELETE FROM gallery WHERE id = ?').run(id);
    dbEvents.emit('gallery_updated');
    return res.json({ success: true });
  }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BACKEND] Server running on http://localhost:${PORT}`);
    console.log(`[BACKEND] Data mode: ${usingFirestore ? 'Firestore' : 'SQLite fallback'}`);
  });

  server.timeout = 0;
  server.keepAliveTimeout = 60000;
}

startServer();
