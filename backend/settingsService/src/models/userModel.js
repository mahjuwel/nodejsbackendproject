const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const userSchema= new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, 'User name length can be minimum 3 characters'],
        maxlength: [31, 'User name length can be maximum 31 characters']
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        trim: true,
        unique: true,
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
        required: [true, "User name is required"],
        trim: true,
        minlength: [1, 'User Id length can be minimum 1 characters'],
        maxlength: [31, 'User Id length can be maximum 31 characters']
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, 'User password length can be minimum 6 characters']
        // set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
   
    designation:{
        type: String,
        required: [true, "Designation is required"],
    },
    zoneId:{
        type: Number,
        required: [true, "Zone Id is required"],
    },
    regionId:{
        type: Number,
        required: [true, "Region Id is required"],
    },
    areaId:{
        type: Number,
        required: [true, "Area Id is required"],
    },
    zoneName:{
        type: String,
        required: [true, "zone Name is required"],
    },
    regionName:{
        type: String,
        required: [true, "region Name is required"],
    },
    areaName:{
        type: String,
        required: [true, "Area Name is required"],
    },
    companyName: {   
            type: String,
            required: [true, "Company Name is required"],            
    },
    phoneNumber : {   
        type: String,
        required: [true, "Phone Number is required"],            
     },
     userRole : {   
        type: String,
        required: [true, "User Role is required"],            
     },
     isBanned: {   
        type: Boolean,
        default: false},
    },{timestamps: true});
    const User= model('User',userSchema);
    module.exports=User;