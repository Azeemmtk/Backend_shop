const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userid: {
        type : mongoose.Types.ObjectId,
        required:true,
    },
    productid:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'product'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      status: {
        type: String,
        required:false,
        default: 'Pending..'
      },
    
})

const cartDB = mongoose.model('cart',cartSchema)
module.exports = cartDB