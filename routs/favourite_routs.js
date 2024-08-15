const express = require('express');
const favouriteDB = require('../model/favourite_schema');
const favouriterouts = express.Router();

favouriterouts.post('/addToFavourite', async (req, res) => {
    try {
      const { userid, productid } = req.body;
  
      // Check if the item is already in the user's cart
      const existingCartItem = await favouriteDB.findOne({ userid: userid, productid: productid });
  
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
        const newfavouriteItem = new favouriteDB({
          userid: userid,
          productid: productid,
        });
  
        const data = await newfavouriteItem.save();
  
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

  favouriterouts.get('/viewFavorite/:userid', async (req, res) => {
    try {
      const { userid } = req.params;
  
      // Populate productid with all product details
      const data = await favouriteDB.find({ userid: userid }).populate('productid');
  
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
  
  
  favouriterouts.delete('/removeFromFavourite/:userid/:productid', async (req, res) => {
    try {
      const { userid, productid } = req.params;
  
      // Find the user's cart and remove the specific item
      const cart = await favouriteDB.deleteOne(
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
  

  module.exports = favouriterouts;