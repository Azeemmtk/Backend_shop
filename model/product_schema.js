const mongoose = require('mongoose')
const productSceema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    details:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    colour:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },

})

const productDB = mongoose.model('product',productSceema)
module.exports = productDB