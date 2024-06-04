const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const offerRcvProductchema= new Schema({
    userId:{
        type: String,
        required: [true, "User Id is required"],
        trim: true
    },  
    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
    },
    factoryName: {
        type: String,
        required: [true, "Factory name is required"],
        trim: true,
    },
    productCategory:{
        type: String,
        required: [true, "Product category is required"],
        trim: true
    },
    skuName:{
        type: String,
        required: [true, "SKU name is required"],
        trim: true
    },
    productId:{
        type: String,
        trim: true
    },
    productPrice:{
        type: Number,
        default: 0,
        trim: true
    },
    rcvQtyPCS:{
        type: Number,
        default: 0,
        required: [true, "Rcv Qty PCS is required"],
        trim: true
    },
    rcvDate : {   
        type: Date,
        trim: true            
     },
    note:{
        type: String,
        trim: true
    },   
     status: {   
        type: Number,
        default: 0},
    },{timestamps: true});
    const OfferRcvProduct= model('OfferRcvProduct',offerRcvProductchema);
    module.exports=OfferRcvProduct;