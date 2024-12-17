const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Add product to cart
router.post("/", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log(`Fetching cart for user: ${userId}`);
    try {
    
    let cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .exec();

    if (!cart) {
     
        cart = new Cart({ userId, items: [] });
      
      console.warn(`Cart not found for user: ${userId}`);
     
    }

    res.status(200).json(cart);
   
  } catch (error) {
    console.error(`Error fetching cart for user: ${userId}`, error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});



router.delete("/delete/:productId", authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
console.log(productId);

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the product exists in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.items.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart, // Include the updated cart in the response
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Error removing product from cart" });
  }
 
});

router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    // Clear the user's cart
    const result = await Cart.findOneAndUpdate(
      { userId }, // Find the user's cart by userId
      { $set: { items: [] } }, // Set the cart items array to an empty array
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Failed to clear cart' });
  }
});

router.put("/decrease/:productId", authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    // Decrease the quantity of the product
    if (cart.items[productIndex].quantity > 1) {
      cart.items[productIndex].quantity -= 1;
    } else {
      // Optionally, remove the item if the quantity becomes zero
      cart.items.splice(productIndex, 1);
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity decreased",
      cart,
    });
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ success: false, message: "Error decreasing quantity" });
  }
});


router.put("/increase/:productId", authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    // Increase the quantity of the product
    cart.items[productIndex].quantity += 1;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      cart,
    });
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ success: false, message: "Error increasing quantity" });
  }
});



router.put("/payment", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    // Adjust product quantities
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        if (product.quantity < item.quantity) {
          return res
            .status(400)
            .json({ success: false, message: `Not enough stock for ${product.name}.` });
        }
        product.quantity -= item.quantity; // Deduct quantity
        await product.save();
      }
    }

    // Clear the user's cart after successful payment
    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Payment successful. Cart cleared." });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: "Payment processing failed." });
  }
});






module.exports = router;
