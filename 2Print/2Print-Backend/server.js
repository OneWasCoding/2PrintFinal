require('dotenv').config();

console.log("Loading .env file...");
console.log("MONGO_URI value is:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/2Print-Data';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// --- AUTH ROUTES ---

// 1. REGISTER
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save User
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token
    const token = jwt.sign({ id: user._id }, 'SECRET_KEY_HERE', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCT ROUTES (NEW) ---

// 3. GET ALL PRODUCTS
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. SEED DATABASE (Run this once to fill your shop)
app.get('/seed-products', async (req, res) => {
  const sampleProducts = [
    {
      name: 'Charizard Base Set',
      set: 'Base Set',
      game: 'Pokémon',
      condition: 'Near Mint',
      price: 350.00,
      image: 'https://placehold.co/400x600/orange/white?text=Charizard',
      category: 'Single Card'
    },
    {
      name: 'The One Ring',
      set: 'Tales of Middle-earth',
      game: 'Magic',
      condition: 'Foil',
      price: 65.50,
      image: 'https://placehold.co/400x600/gold/black?text=One+Ring',
      category: 'Single Card'
    },
    {
      name: 'Blue-Eyes White Dragon',
      set: 'Legend of Blue Eyes',
      game: 'Yu-Gi-Oh!',
      condition: 'Lightly Played',
      price: 120.00,
      image: 'https://placehold.co/400x600/white/blue?text=Blue+Eyes',
      category: 'Single Card'
    },
    {
      name: 'Monkey D. Luffy',
      set: 'Romance Dawn',
      game: 'One Piece',
      condition: 'Near Mint',
      price: 15.00,
      image: 'https://placehold.co/400x600/red/white?text=Luffy',
      category: 'Single Card'
    }
  ];

  try {
    // Clear old data first to avoid duplicates
    await Product.deleteMany({});
    // Insert new data
    await Product.insertMany(sampleProducts);
    res.json({ message: "✅ Database Seeded Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));