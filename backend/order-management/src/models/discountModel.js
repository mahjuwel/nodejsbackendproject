const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const discountSchema= new Schema({
    zoneName:{
        type: String,
        required: [true, "Zone is required"],
        trim: true
    },
    regionName:{
        type: String,
        trim: true
    },
    areaName: {
        type: String,
        trim: true
    },   
    dbPoint: {
        type: String,
        trim: true
    },  
    companyName: {
        type: String,
        required: [true, "Company Name is required"],
        trim: true
    },
    dealerId:{
        type: String,
        required: [true, "Dealer Id is required"],
        trim: true
    },
    creatorId:{
        type:String,
        trim:true
    },
    conditionName:{
        type: String,
        trim: true
    },
    discountType:{
        type: String,
        required: [true, "Discount Type is required"],
        trim: true
    },
    productCategory:{
        type: String,
        required: [true, "Product Category is required"],
        trim: true
    },
    skuName:{
        type: String,
        required: [true, "Product Name is required"],
        trim: true
    },
    
    buyQty:{
        type: Number,
        default: 0,
        trim: true
    },
    discountBDT:{
        type: Number,
        default: 0,
        required: [true, "Discount BDT is required"],
        trim: true
    },
    discountNote:{
        type: String,
        trim: true
    },
    discountStartDate: {   
            type: Date,
            trim: true          
    },
    discountEndDate : {   
        type: Date,
        trim: true            
     },
     status: {   
        type: String,
        trim: true  },
    },    
    {timestamps: true});
    const Discount= model('Discount',discountSchema);
    module.exports=Discount;