const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const offerSchema= new Schema({
    zoneName:{
        type: String,
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
        trim: true
    },
    creatorId:{
        type:String,
        trim:true
    },
    offerType:{
        type: String,
        required: [true, "Offer Type is required"],
        trim: true
    },
    conditionName:{
        type: String,
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
    freeQty:{
        type: Number,
        default: 0,
        trim: true
    },
    totalBudgetQty:{
        type: Number,
        default: 0,
        trim: true
    },
    offerProductCategory:{
        type: String,
        required: [true, "Offer Product Category is required"],
        trim: true
    },
    offerSkuName:{
        type: String,
        required: [true, "Offer Product Name is required"],
        trim: true
    },
    offerSkuPrice:{
        type: String,
        required: [true, "Offer Product Name is required"],
        trim: true
    },
    
    offerNote:{
        type: String,
        trim: true
    },
    offerStartDate: {   
            type: String,
            trim: true          
    },
    offerEndDate : {   
        type: String,
        trim: true            
     },
     checkOffer : {   
        type: String,
        trim: true
     },
     status: {   
        type: Number,
        default: 0},
    },    
    {timestamps: true});
    const Offer= model('Offer',offerSchema);
    module.exports=Offer;