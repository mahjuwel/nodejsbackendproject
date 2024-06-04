const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const orderBankSchema= new Schema({
    doNo:{
        type: String,
        required: [true, "DO No. is required"],
        trim: true
    },
    dealerId:{
        type: String,
        required: [true, "Dealer Id is required"],
        trim: true
    },
    dealerName:{
        type: String,
        required: [true, "DB Name is required"],
        trim: true
    },
    dbType:{
        type: String,
        required: [true, "DB Type is required"],
        trim: true
    },
    superDBId:{
        type: String,
        trim: true
    },
     zone:{
        type: String,
        required: [true, "Zone is required"],
        trim: true
    },
    region:{
        type: String,
        required: [true, "Region is required"],
        trim: true
    },
    area: {
        type: String,
        required: [true, "Area is required"],
        trim: true
    },
    dbPoint: {
        type: String,
        required: [true, "Point is required"],
        trim: true
    }, 
    offerType:{
        type: String,
        trim: true
    },
    discountType:{
        type: String,
        trim: true
    },   
    companyName: {
        type: String,
        required: [true, "Company Name is required"],
        trim: true
    },
   
    phone:{
        type: String,
        required: [true, "DB Phone Number is required"],
        trim: true
    },
    drBDT:{
        type: Number,
        default: 0,
        trim: true
    },   
    crBDT:{
        type: Number,
        default: 0,
        trim: true
    }, 
     paymentDate:{
        type: Date,
         trim: true  
     },       
     orderDate:{
        type: Date,
        trim: true 
     },
     paymentNote:{
        type: String,
        trim: true   
     }, 
     updatePayId:{
        type: String,
        trim: true   
     },   
     status: {   
        type: Number,
        default: 0},
    },{timestamps: true});
    const OrderWithBank= model('OrderWithBank',orderBankSchema);
    module.exports=OrderWithBank;