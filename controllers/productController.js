const Product = require('../models/ProductModel');
const Rating = require('../models/RatingModel');
exports.createProduct = async (req, res) => {
  try {
    const { title, materials, description, category, image } = req.body;

    const product = new Product({
      title,
      materials,
      description,
      category,
      image,
      farmer: req.user ? req.user._id : null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching by category', error: err });
  }
};

// Delete a product (farmer only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only the farmer who created it can delete
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this product" });
    }

    const { title, materials, description, category, image } = req.body;

    product.title = title || product.title;
    product.materials = materials || product.materials;
    product.description = description || product.description;
    product.category = category || product.category;
    product.image = image || product.image;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
};


exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email'); // Example to populate farmer details if needed
    if (!product) return res.status(404).send({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send({ message: 'Server error' });
  }
};

exports.getTopRatedProducts = async (req, res) => {
  try {
    const topRatedProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'ratings',  // ratings collection
          localField: '_id',  // field from products
          foreignField: 'productId',  // field from ratings
          as: 'ratings'
        }
      },
      {
        $project: {
          title: 1,
          image: 1,
          description: 1,
          price: 1,
          avgRating: { $avg: '$ratings.stars' },
        }
      },
      {
        $sort: { avgRating: -1 }  // Sort by average rating in descending order
      },
      {
        $limit: 5  // Get top 5 rated products
      }
    ]);

    res.json(topRatedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
