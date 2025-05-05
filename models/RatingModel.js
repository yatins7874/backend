const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    title: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
