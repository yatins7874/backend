const express = require('express');
const router = express.Router();
const Rating = require('../models/RatingModel');
const { protect } = require('../middleware/authMiddleware'); // Your existing JWT auth middleware

// Submit a rating (only for logged-in users)
router.post('/:productId', protect, async (req, res) => {
  try {
    const { stars, message } = req.body;
    const { productId } = req.params;

    const rating = new Rating({
      productId,
      name: req.user.name, // assuming you store name in JWT payload
      stars,
      message
    });

    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
});

// Get ratings for a product (public)
router.get('/:productId', async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
});

module.exports = router;
