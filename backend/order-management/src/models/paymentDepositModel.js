const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const paymentDepositSchema= new Schema({
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
    companyName: {
        type: String,
        required: [true, "Company Name is required"],
        trim: true
    },
    bankNames:{
        type: String,
        trim: true
    },
    DealerPhone:{
        type: String,
        required: [true, "DB Phone Number is required"],
        trim: true
    },
    bankAccountNo:{
        type: String,
        trim: true
    },
    depositorsBankName:{
        type: String,
        trim: true
    },
    depositorsBranchName:{
        type: String,
        trim: true
    },
    depositorPhone:{
        type: String,
        trim: true
    },
    drBDT:{
        type: Number,
        default: 0,
        required: [true, "Deposit Payment DBT is required"],
        trim: true
    }, 
          
     paymentNote:{
        type: String,
        trim: true   
     },   
     paymentDate:{
        type: Date,
         trim: true  
     }, 
     image: {
        type: String,
        trim: true
    },
    deleteImageUrl: {
        type: String,
        trim: true
    },
    confirmId:{
        type: String,
        trim: true
    },
    approveId:{
        type: String,
        trim: true
    },
     status: {   
        type: Number,
        default: 0},
    },{timestamps: true});
    const PaymentDeposit= model('PaymentDeposit',paymentDepositSchema);
    module.exports=PaymentDeposit;