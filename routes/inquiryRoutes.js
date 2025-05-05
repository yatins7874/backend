// routes/inquiryRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { contactDealer, getMyInquiries } = require('../controllers/inquiryController');


router.post('/contact', protect, contactDealer);
router.get('/mine', protect, getMyInquiries);

module.exports = router;
