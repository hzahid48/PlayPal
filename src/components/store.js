import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CardActions, Collapse, IconButton } from "@mui/material";
import Navbar from './navbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "../styles/Store.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests

const Store = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage1, setErrorMessage] = useState("");
  const [cart, setCart] = useState([]); // Store cart data from API
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const navigate = useNavigate();
 

  
  useEffect(() => {
    // Fetch products from the server
    axios.get("http://localhost:5000/api/products")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);
  
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
        console.log(errorMessage1);
      }
    };

    fetchCartData();
  }, []);

  const refreshCart = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart(response.data.items);
  };
  const handleCheckout = () => {
    navigate("/Payment", { state: { cart } });
  };
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }
  
      const { data } = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
     {
        setCart(data.cart.items); // Update state with new cart items
        
      
        refreshCart();
        alert(data.message || "Unable to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Error adding product to cart.");
    }
  };
  const removeFromCart = async (id) => {
    console.log("ID passed to removeFromCart:", id); // Log the id
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }
  
      const { data } = await axios.delete(`http://localhost:5000/api/cart/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      {
        setCart(data.cart.items); // Update cart state
        refreshCart();
    
        alert(data.message || "Failed to remove product from cart.");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert(error.response?.data?.message || "Error removing product from cart1122.");
    }
  };

  const toggleDescription = (id) => {
    
    setSelectedProductId(selectedProductId === id ? null : id);
  };


  

  const toggleCartVisibility = () => {
    refreshCart();
    setCartVisible(!cartVisible);
  };
 
  
  const increaseQuantity = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/cart/increase/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (data.success) {
        setCart(data.cart.items); // Update cart with new data
        refreshCart();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };
  
  const decreaseQuantity = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/cart/decrease/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (data.success) {
        setCart(data.cart.items); // Update cart with new data
        refreshCart();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="store-container">
        <Container className="store-content">
          <Typography variant="h4" align="center" className="store-title">
            Sports Store
            <hr />
          </Typography>

          {/* Product Listings */}
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                
                  className="product-card"
                  onClick={() => toggleDescription(product._id)}
                  style={{ cursor: "pointer" }}
                >
                
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" className="product-title">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: Rs. {product.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Stock: {product.quantity}
                    </Typography>
                  </CardContent>
                  <Collapse in={selectedProductId === product._id}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        {product.description}
                      </Typography>
                    </CardContent>
                  </Collapse>
                  <CardActions>
                    <Button
                      variant="contained"
                      backgroud-color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling description
                        addToCart(product);
                        
                  
                      }}
                      className="str-btn"
                      disabled={product.quantity === 0} // Disable button if out of stock
                    >
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* Cart Icon */}
      <IconButton
        color="default"
        onClick={toggleCartVisibility}
        sx={{
          position: "absolute",
          top: { xs: "50px", sm: "60px", md: "60px" },
          right: { xs: "10px", sm: "15px", md: "5px" },
          zIndex: 1000,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: { xs: 30, sm: 35, md: 30, lg: 40 }, color: "white" }} />
      </IconButton>

      {/* Cart Section */}
      {cartVisible && (
        <div
          className="cart-container"
          style={{
            position: "fixed",
            right: 0,
            top: "130px",
            padding: "20px",
            width: "100%",
            maxWidth: "300px",
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
            zIndex: 100,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Shopping Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" align="center">
              Your cart is empty
            </Typography>
          ) : (
            <Grid container spacing={2} justifyContent="center">
            
            {cart.map((item,index) => (
  <Grid item xs={12} key={index}>
    <Card className="cart-item" style={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.productId.name}
        </Typography>
        <Typography variant="body2">Rs. {item.productId.price}</Typography>
        <Typography variant="body2">Quantity: {item.quantity}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => decreaseQuantity(item.productId._id)}
          disabled={item.quantity === 1} // Disable if quantity is 1
        >
          -
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => increaseQuantity(item.productId._id)}
        >
          +
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => removeFromCart(item.productId._id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  </Grid>
))}
</Grid>
          )}
          <Typography
            variant="h6"
            align="center"
            className="total-price"
            style={{ marginTop: "20px" }}
          >
            Total: Rs. {cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="str-btn"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Store;


