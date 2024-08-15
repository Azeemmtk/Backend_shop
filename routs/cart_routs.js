const express = require('express');
const cartDB = require('../model/cart_schema');
const cartrouts = express.Router();

cartrouts.post('/addToCart', async (req, res) => {
  try {
    const { userid, productid } = req.body;

    // Check if the item is already in the user's cart
    const existingCartItem = await cartDB.findOne({ userid: userid, productid: productid });

    if (existingCartItem) {
      // If item already exists, return a message
      return res.status(200).json({
        Success: false,
        Error: false,
        Message: 'Item is already in the cart',
        data: existingCartItem,
      });
    } else {
      // If item does not exist, add a new item to the cart
      const newCartItem = new cartDB({
        userid: userid,
        productid: productid,
        quantity: 1, // Initial quantity set to 1
      });

      const data = await newCartItem.save();

      return res.status(201).json({
        Success: true,
        Error: false,
        Message: 'Item added to cart successfully',
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});

cartrouts.get('/viewCart/:userid', async (req, res) => {
  try {
    const { userid } = req.params;

    // Populate productid with all product details
    const data = await cartDB.find({ userid: userid }).populate('productid');

    if (data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: data,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'No items found in the cart',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error,
    });
  }
});

cartrouts.put('/updateCart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userid, productid, quantity, status } = req.body;

    const updatedData = {
      userid: userid,
      productid: productid,
      quantity: quantity,
      status :status
    };

    const data = await cartDB.findByIdAndUpdate(id, updatedData, { new: true });

    if (data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Cart item updated successfully',
        data: data,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Cart item not updated',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});

cartrouts.get('/viewAllCarts', async (req, res) => {
  try {
    // Retrieve all cart data, and populate productid with all product details
    const data = await cartDB.find({}).populate('productid');

    if (data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: data,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'No cart data found',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});


cartrouts.delete('/removeFromCart/:userid/:productid', async (req, res) => {
  try {
    const { userid, productid } = req.params;

    // Find the user's cart and remove the specific item
    const cart = await cartDB.deleteOne(
      { userid: userid, productid: productid }
    );

    if (cart) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Item removed from cart successfully',
        data: cart,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Item not removed from cart',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});


cartrouts.put('/increaseQuantity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the cart item and increment the quantity by 1
    const updatedCartItem = await cartDB.findByIdAndUpdate(
      id,
      { $inc: { quantity: 1 } }, // Increment quantity by 1
      { new: true }
    );

    if (updatedCartItem) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Quantity increased successfully',
        data: updatedCartItem,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Quantity not increased',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});


cartrouts.put('/decreaseQuantity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the cart item
    const cartItem = await cartDB.findById(id);
    
    if (!cartItem) {
      return res.status(404).json({
        Error: true,
        Success: false,
        Message: 'Cart item not found',
      });
    }
    
    // Check if the quantity is greater than 1 before decrementing
    if (cartItem.quantity > 1) {
      const updatedCartItem = await cartDB.findByIdAndUpdate(
        id,
        { $inc: { quantity: -1 } }, // Decrement quantity by 1
        { new: true }
      );

      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Quantity decreased successfully',
        data: updatedCartItem,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Quantity cannot be less than 1',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
});


module.exports = cartrouts;
