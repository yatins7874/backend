const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  deleteProduct,
  getMyProducts,
  updateProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProduct);
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.delete('/:id', protect, deleteProduct);
router.get('/myproducts', protect, getMyProducts);
router.put('/:id', protect, updateProduct);

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
