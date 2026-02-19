const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  set: { type: String, required: true },
  game: { type: String, required: true }, // e.g., "Magic", "Pokemon"
  condition: { type: String, default: 'Near Mint' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true } // e.g., "TCG"
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);