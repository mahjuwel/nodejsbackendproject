const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const orderScheduleSchema= new Schema({
    userId:{
        type: String,
        required: [true, "User Id is required"],
        trim: true
    },  
    dealerId:{
        type: String,
        required: [true, "Dealer Id is required"],
        trim: true
    },
    doNo:{
        type: String,
        required: [true, "DO No. is required"],
        trim: true
    },  
    scheduleNo:{
        type: String,
        required: [true, "DO No. is required"],
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
    zoneName:{
        type: String,
        trim: true
    },
    regionName:{
        type: String,
        trim: true
    },
    areaName:{
        type: String,
        trim: true
    },
    dbPoint:{
        type: String,
        trim: true
    },
    delQtyCtn:{
        type: Number,
        default: 0,
        required: [true, "Delivery Qty CTN is required"],
        trim: true
    },
    delQtyPcs:{
        type: Number,
        default: 0,
        required: [true, "Delivery Qty PCS is required"],
        trim: true
    },
    offerNote:{
        type: String,
        trim: true
    },
    orderDate : {   
        type: Date,
        trim: true            
     },
     deliveryDate : {   
        type: Date,
        trim: true            
     },
     deliveryDateEnd : {   
        type: Date,
        trim: true            
     },
     scheduleDate : {   
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
    const OrderSchedule= model('OrderSchedule',orderScheduleSchema);
    module.exports=OrderSchedule;