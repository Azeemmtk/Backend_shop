const { error } = require('console')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRouter = require('./routs/auth_routs')
const productrouts = require('./routs/product_rout')
const cartrouts = require('./routs/cart_routs')
const favouriterouts = require('./routs/favourite_routs')
require ('dotenv').config();
mongoose.connect('mongodb+srv://aseemmtk:uWl1NzkXzbcnAHbT@cluster0.64d02pt.mongodb.net/shop')
.then(()=>{console.log('Database connected')})
.catch((error)=>{
    console.log(error)
})

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))


app.use('/api/auth',authRouter) 
app.use('/api/product',productrouts)
app.use('/api/cart',cartrouts)
app.use('/api/favourite',favouriterouts)
    
app.listen(8083,()=>{
    console.log("server started");
})