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
    
})

const favouriteDB = mongoose.model('favourite',cartSchema)
module.exports = favouriteDB