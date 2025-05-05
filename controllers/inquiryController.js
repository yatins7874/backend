// controllers/inquiryController.js
const Inquiry = require('../models/InquiryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const nodemailer = require('nodemailer');

exports.contactDealer = async (req, res) => {
    try {
      const { productId, message } = req.body;
      const product = await Product.findById(productId).populate('farmer', 'email name');
      const user = await User.findById(req.user._id);
  
      if (!product || !product.farmer) {
        return res.status(404).json({ message: 'Product or dealer not found' });
      }
  
      // Send email to dealer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: product.farmer.email,
        subject: `Inquiry from ${user.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #333;">You have a new product inquiry</h2>
              
              <p style="font-size: 16px; color: #555; text-align: justify;">
                <strong>From:</strong> ${user.name} (${user.email})
              </p>
      
              <p style="font-size: 16px; color: #555; text-align: justify;">
                <strong>Message:</strong> ${message || 'No message provided'}
              </p>
      
              <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
      
              <h3 style="color: #333;">Product Details</h3>
              
              <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                <div style="width: 48%; font-size: 16px; color: #555;">
                  <p><strong>Title:</strong> ${product.title}</p>
                  <p><strong>Category:</strong> ${product.category}</p>
                </div>
      
                <div style="width: 48%; text-align: center;">
                  <img src="${product.image}" alt="${product.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
                </div>
              </div>
      
              <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #aaa;">
                <p>Thank you for using our platform!</p>
              </footer>
            </div>
          </div>
        `,
      };
      
  
      await transporter.sendMail(mailOptions);
  
      // Save inquiry
      const inquiry = new Inquiry({
        user: req.user._id,
        product: product._id,
        message,
      });
  
      await inquiry.save();
  
      res.json({ message: 'Inquiry sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send inquiry' });
    }
  };

// GET /api/inquiries/mine
exports.getMyInquiries = async (req, res) => {
    try {
      const inquiries = await Inquiry.find({ user: req.user._id }).populate('product');
      res.json(inquiries);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch inquiries' });
    }
  };
  