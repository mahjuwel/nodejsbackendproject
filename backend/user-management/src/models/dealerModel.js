const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const dbSchema= new Schema({
    distributorName: {
        type: String,
        required: [true, "Dealer name is required"],
        unique:true,
        trim: true,
        minlength: [3, 'User name length can be minimum 3 characters'],
        // maxlength: [31, 'User name length can be maximum 31 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true       
        },
    userId:{
        type: String,
        required: [true, "DB Id is required"],
        trim: true,
        unique:true,
        minlength: [1, 'DB Id length can be minimum 1 characters'],
        maxlength: [31, 'DB Id length can be maximum 31 characters']
    },
    superDBId:{
        type: String,
        trim: true
     },
    creatorId:{
        type: String,
        trim: true
    },
    erpId:{        
        type: String,
        trim: true
      },
    password: {
        type: String,
        required: [true, "Dealer password is required"],
        // minlength: [6, 'Dealer password length can be minimum 6 characters'],
        trim: true
        // set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
   
    userRole: {
        type: String,
        required: [true, "BD Type is required"],
        trim: true
    },
    crBDTLimit : {   
        type: Number,
        default:0,
        trim: true           
     },
    hasStorage:{
        type: Boolean,
        default: false,
        trim: true
    },
    proprietor:{
        type: String,
        required: [true, "Proprietor is required"],
        trim: true
    },
    dbOpeningDate:{
        type: Date,
        trim: true
    },
    proprietorDOB:{
        type: Date,
        trim: true
    },
    address:{
        type: String,
        required: [true, "DB address is required"],
        trim: true
    },
    hasPC:{
        type: Boolean,
        default: false,
        trim: true
    },
    hasPrinter:{
        type: Boolean,
        default: false,
        trim: true
    },
    
    hasApp:{
        type: Boolean,
        default: false,
        trim: true
    },
    zoneName:{
        type: String,
        required: [true, "zone Name is required"],
        trim: true
    },
    regionName:{
        type: String,
        required: [true, "region Name is required"],
        trim: true
    },
    areaName:{
        type: String,
        required: [true, "Area Name is required"],
        trim: true
    },
    dbPoint:{
        type: String,
        required: [true, "Area Name is required"],
        trim: true
    },
    companyName: {   
            type: String,
            required: [true, "Company Name is required"],
            trim: true         
    },
    phoneNumber : {   
        type: String,
        required: [true, "Phone Number is required"], 
        trim: true           
     },
     emergencyContactName : {   
        type: String,
        trim: true         
     },
     emergencyMobileNumber : {   
        type: String,
        trim: true        
     },
     emergencyContactRelation:{
        type: String, 
        trim: true
     },
     unitName:{
        type: String, 
        default:'CTN',
        trim: true
     },
     status: {   
        type: Boolean,
        default: true},
    },{timestamps: true});
    const Distributor= model('Distributor',dbSchema);
    module.exports=Distributor;