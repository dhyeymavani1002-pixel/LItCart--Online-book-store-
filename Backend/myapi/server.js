const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const seedBooks = require('./data/books');

loadEnvFile();

const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;
const SHIPPING_FEE = 49;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'LitCart';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const DEFAULT_MONGODB_URI =
  process.env.NODE_ENV === 'production'
    ? ''
    : 'mongodb://Dhyey:1124@ac-6ntcovj-shard-00-00.aietasu.mongodb.net:27017,ac-6ntcovj-shard-00-01.aietasu.mongodb.net:27017,ac-6ntcovj-shard-00-02.aietasu.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-83450d-shard-0&retryWrites=true&w=majority&appName=Cluster0';

const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    rating: String,
    date: String,
    text: String
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: String,
    author: String,
    price: Number,
    oldPrice: Number,
    rating: Number,
    ratingCount: Number,
    category: String,
    badge: String,
    cover: String,
    desc: String,
    pages: Number,
    publisher: String,
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    price: Number,
    qty: Number,
    cover: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, default: '', index: true },
    userEmail: { type: String, default: '', lowercase: true, trim: true, index: true },
    customer: {
      firstName: String,
      lastName: String,
      fullName: String,
      email: String,
      phone: String,
      address: {
        line1: String,
        city: String,
        state: String,
        pin: String,
        country: String
      }
    },
    items: [orderItemSchema],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: Number,
    status: { type: String, default: 'confirmed' },
    paymentMethod: String
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Order = mongoose.model('Order', orderSchema);

let storageMode = 'memory';
let memoryUsers = [];
let memoryBooks = seedBooks.map(book => ({ ...book }));
let memoryOrders = [];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.length === 0) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', storageMode, databaseName: MONGODB_DB_NAME });
});

app.get('/users', async (req, res) => {
  try {
    if (storageMode === 'mongo') {
      return res.json(await User.find().select('-password').sort({ createdAt: -1 }).lean());
    }
    res.json(memoryUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    if (storageMode === 'mongo') {
      const email = (req.body.email || '').trim().toLowerCase();
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingUser.name = req.body.name?.trim() || existingUser.name;
        existingUser.phone = req.body.phone?.trim() || existingUser.phone;
        await existingUser.save();
        return res.json(toAuthUser(existingUser));
      }

      if (!req.body.password) {
        return res.status(400).json({ error: 'Password is required for new users.' });
      }

      const user = await User.create({
        name: req.body.name?.trim(),
        email,
        phone: req.body.phone?.trim() || '',
        password: req.body.password
      });
      return res.status(201).json(toAuthUser(user));
    }

    const user = {
      _id: String(Date.now()),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      password: req.body.password || '',
      createdAt: new Date().toISOString()
    };
    memoryUsers = [user, ...memoryUsers];
    res.status(201).json(toAuthUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/signup', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = req.body.phone?.trim() || '';
    const password = req.body.password || '';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (storageMode === 'mongo') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const user = await User.create({ name, email, phone, password });
      return res.status(201).json({ message: 'Signup successful.', user: toAuthUser(user) });
    }

    const existingUser = memoryUsers.find(user => user.email.toLowerCase() === email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = {
      _id: `user-${Date.now()}`,
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };
    memoryUsers = [user, ...memoryUsers];
    return res.status(201).json({ message: 'Signup successful.', user: toAuthUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (storageMode === 'mongo') {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      return res.json({ message: 'Login successful.', user: toAuthUser(user) });
    }

    const user = memoryUsers.find(
      savedUser => savedUser.email.toLowerCase() === email && savedUser.password === password
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({ message: 'Login successful.', user: toAuthUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    if (storageMode === 'mongo') {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(toAuthUser(user));
    }

    const index = memoryUsers.findIndex(user => user._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    memoryUsers[index] = { ...memoryUsers[index], ...req.body };
    res.json(toAuthUser(memoryUsers[index]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    if (storageMode === 'mongo') {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ message: 'User deleted successfully' });
    }

    const originalLength = memoryUsers.length;
    memoryUsers = memoryUsers.filter(user => user._id !== req.params.id);
    if (memoryUsers.length === originalLength) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    if (storageMode === 'mongo') {
      return res.json(await Book.find().sort({ id: 1 }).lean());
    }
    res.json(memoryBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const ownerFilter = getOrderOwnerFilter(req.query);
    if (!ownerFilter) {
      return res.json([]);
    }

    if (storageMode === 'mongo') {
      return res.json(await Order.find(ownerFilter.mongo).sort({ createdAt: -1 }).lean());
    }
    res.json(
      memoryOrders
        .filter(order => orderMatchesOwner(order, ownerFilter.userId, ownerFilter.email))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const validationError = validateOrder(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const order = buildOrder(req.body);

    if (storageMode === 'mongo') {
      const createdOrder = await Order.create(order);
      return res.status(201).json({
        message: 'Order saved successfully',
        order: createdOrder.toObject()
      });
    }

    memoryOrders = [order, ...memoryOrders];
    res.status(201).json({
      message: 'Order saved successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function validateOrder(payload) {
  const customer = payload.customer || {};
  const address = customer.address || {};

  if (!customer.firstName || !customer.email || !customer.phone) {
    return 'Customer name, email, and phone are required.';
  }

  if (!address.line1 || !address.pin) {
    return 'Address and PIN code are required.';
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return 'Order must include at least one item.';
  }

  return null;
}

function buildOrder(payload) {
  const items = payload.items.map(item => ({
    id: item.id,
    title: item.title,
    price: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
    cover: item.cover || ''
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const discount = Number(payload.discount) || 0;
  const total = subtotal + SHIPPING_FEE + tax - discount;
  const userEmail = normalizeEmail(payload.userEmail || payload.customer.email);

  return {
    orderId: createOrderId(),
    transactionId: createTransactionId(),
    userId: sanitizeText(payload.userId),
    userEmail,
    customer: {
      firstName: payload.customer.firstName,
      lastName: payload.customer.lastName || '',
      fullName:
        payload.customer.fullName ||
        [payload.customer.firstName, payload.customer.lastName].filter(Boolean).join(' '),
      email: normalizeEmail(payload.customer.email),
      phone: payload.customer.phone,
      address: {
        line1: payload.customer.address.line1,
        city: payload.customer.address.city || '',
        state: payload.customer.address.state || '',
        pin: payload.customer.address.pin,
        country: payload.customer.address.country || 'India'
      }
    },
    items,
    subtotal,
    shipping: SHIPPING_FEE,
    tax,
    discount,
    total,
    status: payload.status || 'confirmed',
    paymentMethod: payload.paymentMethod || 'Credit / Debit Card',
    createdAt: new Date().toISOString()
  };
}

function getOrderOwnerFilter(query) {
  const userId = sanitizeText(query.userId);
  const email = normalizeEmail(query.email);
  const clauses = [];

  if (userId) {
    clauses.push({ userId });
  }

  if (email) {
    clauses.push({ userEmail: email }, { 'customer.email': email });
  }

  if (clauses.length === 0) {
    return null;
  }

  return {
    userId,
    email,
    mongo: clauses.length === 1 ? clauses[0] : { $or: clauses }
  };
}

function orderMatchesOwner(order, userId, email) {
  if (userId && order.userId === userId) {
    return true;
  }

  if (!email) {
    return false;
  }

  return normalizeEmail(order.userEmail) === email || normalizeEmail(order.customer?.email) === email;
}

function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function createOrderId() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `#LC-${year}-${random}`;
}

function createTransactionId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TXN-${stamp}-${random}`;
}

function toAuthUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    createdAt: user.createdAt
  };
}

async function seedBooksIfNeeded() {
  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany(seedBooks);
  }
}

async function startServer() {
  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured.');
    }
    await mongoose.connect(mongoUri, {
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000
    });
    storageMode = 'mongo';
    await seedBooksIfNeeded();
    console.log(`MongoDB connected to database: ${MONGODB_DB_NAME}`);
  } catch (error) {
    storageMode = 'memory';
    console.error('MongoDB connection failed:', error.message);
    console.error(
      'Using in-memory data for now. Add your current IP address in Atlas Network Access to enable MongoDB persistence.'
    );
  }

  app.listen(PORT, HOST, () =>
    console.log(`API running on http://${HOST}:${PORT} (${storageMode} mode)`)
  );
}

startServer();
