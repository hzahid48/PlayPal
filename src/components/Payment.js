import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Card, CardContent, Typography, Alert } from "@mui/material";

import Navbar from "./navbar";
import "../styles/payment.css";
import axios from "axios"; // Make sure to install axios

const Payment = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    postalCode: "",
    paymentMethod: "cash",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: ""
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cart, setCart] = useState([]); // Store cart data from API

  // Fetch cart data from the API when component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCart(response.data.items); // Set cart items from API response
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setErrorMessage("Cart is empty.");
      }
    };

    fetchCartData();
  }, []);

  // Handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.postalCode) {
      setErrorMessage("All fields are required!");
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (isNaN(formData.postalCode)) {
      setErrorMessage("Postal code should be numeric.");
      return;
    }

    if (formData.paymentMethod === "card" && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV)) {
      setErrorMessage("Please fill in card details.");
      return;
    }

    setErrorMessage(""); // Reset error message
   
    try {
      const token = localStorage.getItem("token");
  
      // Make API request to process payment and update product quantities
      const response = await axios.put(
        "http://localhost:5000/api/cart/payment",
        {}, // Pass any required payload if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setPaymentSuccess(true); // Show payment success alert
        try {
          // Send request to clear the cart after successful payment
          const token = localStorage.getItem("token");
          await axios.delete("http://localhost:5000/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          // Update the local cart state to clear the cart
          setCart([]); // Clear cart locally
        } catch (error) {
          console.error("Error clearing cart:", error);
          setErrorMessage("Failed to clear the cart.");
        }
        
      } else {
        setErrorMessage(response.data.message || "Payment failed bro.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setErrorMessage(error.response?.data?.message || "Payment failed sis.");
    }
    
  };

  // Calculate total price of cart items
  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const product = item.productId;
      if (product) {
        return acc + (product.price * item.quantity); // Calculate price * quantity for each item
      }
      return acc;
    }, 0);
  };

  return (
    <div>
      <Navbar />
      <div className="pay-container">
        <div className="pay-content">
          <Typography variant="h4" align="center" className="pay-title">Payment Page</Typography>

          {/* Show Success Payment Alert */}
          {paymentSuccess && (
            <Alert severity="success" style={{ marginBottom: "20px" }}>
              Payment Successful!
            </Alert>
          )}

          {/* Show Error Message */}
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: "20px" }}>
              {errorMessage}
            </Alert>
          )}

          {/* Order Summary */}
          <Card style={{ marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <div>
                {cart.map((item, index) => (
                  <div key={index}>
                    {item.productId ? (
                      <Typography variant="body2">
                        {item.productId.name} - {item.quantity} x Rs. {item.productId.price}
                      </Typography>
                    ) : (
                      <Typography variant="body2">Item not available</Typography>
                    )}
                  </div>
                ))}
              </div>
              <Typography variant="h6" style={{ marginTop: "10px" }}>
                Total: Rs. {calculateTotal()}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <form onSubmit={handlePaymentSubmit}>
                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ marginBottom: "15px" }}
                />

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ marginBottom: "15px" }}
                />

                {/* Address Field */}
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ marginBottom: "15px" }}
                />

                {/* Postal Code Field */}
                <TextField
                  fullWidth
                  label="Postal Code"
                  variant="outlined"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={{ marginBottom: "15px" }}
                />

                {/* Payment Method Radio Buttons */}
                <FormControl component="fieldset" style={{ marginBottom: "15px" }}>
                  <RadioGroup
                    row
                    aria-label="payment-method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
                    <FormControlLabel value="card" control={<Radio />} label="Card Payment" />
                  </RadioGroup>
                </FormControl>

                {/* Card Details (only shown for card payment) */}
                {formData.paymentMethod === "card" && (
                  <div>
                    <TextField
                      fullWidth
                      label="Card Number"
                      variant="outlined"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      style={{ marginBottom: "15px" }}
                    />
                    <TextField
                      fullWidth
                      label="Expiry Date (MM/YY)"
                      variant="outlined"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      style={{ marginBottom: "15px" }}
                    />
                    <TextField
                      fullWidth
                      label="CVV"
                      variant="outlined"
                      name="cardCVV"
                      value={formData.cardCVV}
                      onChange={handleChange}
                      style={{ marginBottom: "15px" }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginBottom: "10px" }}
                  className="pay-button"
                >
                  Proceed to Payment
                </Button>

                {/* Continue Shopping Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  href="/store/"
                  className="pay-button1"
                >
                  Continue Shopping
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;


