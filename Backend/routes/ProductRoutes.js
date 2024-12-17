const express = require("express");
const Product = require("../models/Products");

const router = express.Router();

// Add a new product
router.post("/", async (req, res) => {
  const { name, description, price, image, quantity } = req.body;
  try {
    const product = new Product({ name, description, price, image, quantity });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

// Example Node.js/Mongoose route
router.patch('/products/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.quantity -= quantity;  // Reduce the quantity by the amount purchased
      await product.save();
      res.status(200).json({ message: 'Product stock updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product stock', error });
  }
});

module.exports = router;
