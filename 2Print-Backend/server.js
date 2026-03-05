require('dotenv').config();

console.log("Loading .env file...");
console.log("MONGO_URI value is:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2; // <--- NEW: Import Cloudinary

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();

// --- NEW: Increase JSON limits for base64 image uploads ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- NEW: Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/2Print-Data';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// --- AUTH & USER ROUTES ---

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

// 3. UPDATE USERNAME
app.put('/update-profile', async (req, res) => {
  try {
    const { email, newUsername } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: email }, 
      { username: newUsername }, 
      { returnDocument: 'after' } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

// 4. CHANGE PASSWORD
app.put('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
});

// 5. DELETE ACCOUNT
app.delete('/delete-account', async (req, res) => {
  try {
    const { email } = req.body;

    const deletedUser = await User.findOneAndDelete({ email: email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account successfully deleted from database" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
});

// --- PRODUCT ROUTES ---

// 6. GET ALL PRODUCTS
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: ADD A PRODUCT (WITH CLOUDINARY UPLOAD) ---
app.post('/add-product', async (req, res) => {
  try {
    const { name, set, game, condition, price, base64Image, category } = req.body;

    if (!name || !price || !base64Image) {
      return res.status(400).json({ message: "Missing required fields or image." });
    }

    // 1. Upload the base64 string to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: '2print_cards', 
    });

    // 2. Get the secure URL from Cloudinary
    const imageUrl = uploadResponse.secure_url;

    // 3. Save the new product to MongoDB
    const newProduct = new Product({
      name,
      set,
      game,
      condition,
      price: parseFloat(price),
      image: imageUrl, 
      category
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error while adding product", error: error.message });
  }
});

// 7. SEED DATABASE
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
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    res.json({ message: "✅ Database Seeded Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));