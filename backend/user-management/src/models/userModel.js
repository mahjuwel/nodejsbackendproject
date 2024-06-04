const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const userSchema= new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, 'User name length can be minimum 3 characters']
        // maxlength: [31, 'User name length can be maximum 31 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {          
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    userId:{
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        minlength: [1, 'User Id length can be minimum 1 characters'],
        maxlength: [31, 'User Id length can be maximum 31 characters']
    },
    superDBId:{
        type: String,
        trim: true
    },
    creatorId:{
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, 'User password length can be minimum 6 characters'],
        trim: true
        // set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    factoryName:{
        type: String,
        trim: true
    },   
    designation:{
        type: String,
        required: [true, "Designation is required"],
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
     userRole : {   
        type: String,
        required: [true, "User Role is required"],  
        trim: true          
     },
     isBanned: {   
        type: Boolean,
        default: false},
    },{timestamps: true});
    const User= model('User',userSchema);
    module.exports=User;