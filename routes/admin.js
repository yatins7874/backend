// routes/admin.js
const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// GET total user count (all + by roles)
router.get('/user-stats', async (req, res) => {
  try {
    const total = await UserModel.countDocuments();
    const admins = await UserModel.countDocuments({ role: 'admin' });
    const clients = await UserModel.countDocuments({ role: 'client' });
    const farmers = await UserModel.countDocuments({ role: 'farmer' });

    res.json({ total, admins, clients, farmers });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
