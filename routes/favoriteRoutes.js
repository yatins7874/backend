const express = require('express');
const router = express.Router();
const Favorite = require('../models/FavoriteModel');
const Product = require('../models/ProductModel');
const { protect } = require('../middleware/authMiddleware');

// Add a product to the favorites
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is already in the favorites
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product is already in favorites' });
    }

    // Add to favorites
    const favorite = new Favorite({ userId, productId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Remove a product from the favorites
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Remove from favorites
    const favorite = await Favorite.findOneAndDelete({ userId, productId });
    if (!favorite) {
      return res.status(404).json({ message: 'Product not found in favorites' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get the user's favorites
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all favorite products for the user
    const favorites = await Favorite.find({ userId }).populate('productId');
    res.status(200).json(favorites.map(fav => fav.productId));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
