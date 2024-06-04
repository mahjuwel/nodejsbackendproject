const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const orderSchema= new Schema({
    dealerId:{
        type: String,
        required: [true, "Dealer Id is required"],
        trim: true
    },
    distributorName:{
        type: String,
        required: [true, "Dealer Name is required"],
        trim: true
    },
    dbType:{
        type: String,
        required: [true, "DB Type is required"],
        trim: true
    },
    doNo: {
        type: String,
        required: [true, "Do No. is required"],
        trim: true,
    },
    superDBId:{
        type: String,
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
    doDate: {
        type: Date,
        trim: true,
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
    factoryName:[{
        type: String,
        required: true,
        trim: true
      }],
     
    categoryName:{
        type: String,
        required: [true, "Category Name is required"],
        trim: true
    },
    skuName:{
        type: String,
        required: [true, "Product Name is required"],
        trim: true
    },
    productId:{
        type: String,
        trim: true
    },
    dpCTN:{
        type: Number,
        default: 0,
        trim: true
    },
    pcsCTN:{
        type: Number,
        default: 0,
        trim: true
    },
    totalOrderQtyPCS:{
        type: Number,
        default: 0,
        trim: true
    },
    orderQtyCtn:{
        type: Number,
        default: 0,
        required:true,
        trim: true
    },    
    totalPrice:{
        type: Number,
        default: 0,
        trim: true
    },
    deliveryQty:{
        type: Number,
        default: 0,
        trim: true
    },
    offerPc:{
        type: Number,
        default:0,
        trim: true
    },
    offerNote:{
        type: String,
        trim: true
    },
    cancelNote:{
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
     discountBDT : {   
        type: Number,
        default:0,
        trim: true           
     },
     discountNote:{
        type: String,
        trim: true
    },
     discountStartDate : {   
        type: Date,
        trim:true           
     },
     discountEndDate:{
        type: Date,
         trim: true  
     },  
     checkedId:{
        type: String,
        trim: true 
     },     
     authorisedId:{
        type: String,
        trim: true 
     },
     confirmedId:{
        type: String,
        trim: true 
     },
     approvedId:{
        type: String,
        trim: true   
     },
     deliveryById:{
        type: String,
        trim: true   
     },     
     status: {   
        type: Number,
        default: 0},
    },{timestamps: true});
    const Order= model('Order',orderSchema);
    module.exports=Order;