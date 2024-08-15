const express = require('express');
const productDB = require('../model/product_schema');
const productrouts = express.Router()

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shop',
  },
});
const upload = multer({ storage: storage });

productrouts.post('/addProduct',upload.single('image'),async (req, res) => {
  try {
    const Data = {
      name: req.body.name,
      category:req.body.category,
      price: req.body.price,
      details:req.body.details,
      size:req.body.size,
      colour:req.body.colour,
      image:req.file.path

    };

    const data = await productDB(Data).save();
    if (data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        Message: 'Data added successfully',
        data: data,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Data not added',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error,
    });
  }
});


productrouts.get('/viewProduct', async(req, res) => {
    await productDB.find()
      .then((data) => {
       return res.status(200).json({
          Success: true,
          Error: false,
          data: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          Success: false,
          Error: true,
          ErrorMessage: error,
        });
      });
  });
    
  productrouts.put('/updateProduct/:id',upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const oldData = await productDB.findOne({_id:id})
        const updatedData = {
            name: req.body.name,
            category:req.body.category,
            price: req.body.price,
            details: req.body.details,
            size: req.body.size,
            colour: req.body.colour,
            image:req.file?req.file.path:oldData.image
        };

  
        const data = await productDB.findByIdAndUpdate(id, updatedData, { new: true });
  
        if (data) {
            return res.status(200).json({
                Success: true,
                Error: false,
                Message: 'Data updated successfully',
                data: data,
            });
        } else {
            return res.status(400).json({
                Error: true,
                Success: false,
                Message: 'Error, Data not updated',
            });
        }
    } catch (error) {
        return res.status(400).json({
            Error: true,
            Success: false,
            Message: 'Internal server error',
            ErrorMessage: error,
        });
    }
  });
  
  
  
  
  
  productrouts.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
  
        const data = await productDB.findByIdAndDelete(id);
  
        if (data) {
            return res.status(200).json({
                Success: true,
                Error: false,
                Message: 'Data deleted successfully',
                data: data,
            });
        } else {
            return res.status(400).json({
                Error: true,
                Success: false,
                Message: 'Error, Data not deleted',
            });
        }
    } catch (error) {
        return res.status(400).json({
            Error: true,
            Success: false,
            Message: 'Internal server error',
            ErrorMessage: error,
        });
    }
  });

module.exports = productrouts