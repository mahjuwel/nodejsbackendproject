const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const productSchema= new Schema({
    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    factoryName:[{
        type: String,
        required: true,
        trim: true
      }],
    creatorId:{
        type: String,
        trim: true,
    },
    categoryName: {
        type: String,
        required: [true, "Category name is required"],
        trim: true       
    },  
 
    skuName: {
        type: String,
        required: [true, "Sku Name is required"],
        trim: true
    },
   
    skuBengaliName:{
        type: String,
        trim: true
    },
    productShortName:{
        type: String,
        trim: true
    },
    distributorPrice:{
        type: Number,
        default:0,
        trim: true
    },
    commPrice:{
        type: Number,
        default:0,
        trim: true
    },
    wholesellPrice:{
        type: Number,
        default:0,
        trim: true
    },
    spotPrice:{
        type: Number,
        default:0,
        trim: true
    },
    specialPCPrice:{
        type: Number,
        default:0,
        trim: true
    },
    tradePrice:{
        type: Number,
        required: [true, "Trade Price is required"],
        trim: true
    },
    erpId:{
        type: String,
        trim: true
    },
    unit:{
        type: String,
        trim: true
    },
    pcsCTN:{
        type: Number,
        required: [true, "PCS CTN is required"],
        trim: true
    },
    weightPCS:{
        type: Number,
        required: [true, "Weight is required"],
        trim: true
    },
    productOpenDate:{
        type: String,
        trim: true
    },
    closingDate:{
        type: String,
        trim: true
    },
    imageUrl:{
        type: String,
        trim: true
    },
    status:{
        type: Boolean,
        default: true
    },
    statusNew:{
        type: Boolean,
        default: true
    }
    },{timestamps: true});
    const Product= model('Product',productSchema);
    module.exports=Product;