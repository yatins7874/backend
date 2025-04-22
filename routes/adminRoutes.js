// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// GET all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // Don't send passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // UPDATE user
  router.put('/users/:id', async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
