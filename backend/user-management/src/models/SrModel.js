const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const srSchema= new Schema({
    companyName: {   
        type: String,
        required: [true, "Company Name is required"],  
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
    dealerId:{
        type: String,
        required: [true, "Dealer Id is required"],
        trim: true 
    },
    dealerName:{
        type: String,
        required: [true, "Dealer Name is required"],
        trim: true 
    },
    srName: {
        type: String,
        required: [true, "SR name is required"],
        trim: true,
        minlength: [3, 'Sr name length can be minimum 3 characters'],
        maxlength: [50, 'Sr name length can be maximum 50 characters']
    },
    userRole:{
        type: String,
        required: [true, "SR Role is required"],
        trim: true 
    },
    userId:{
        type: String,
        required: [true, "User ID is required"],
        trim: true,
        minlength: [1, 'User Id length can be minimum 1 characters'],
        maxlength: [31, 'User Id length can be maximum 31 characters']
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        maxlength: [50, 'Password can be maximum 50 characters']
    },
    email: {
        type: String,
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
  
  
    mobileNo : {   
        type: String,
        required: [true, "Phone Number is required"], 
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true        
     },
     sscYear : {   
        type: String,
        maxlength: [10, 'Length can be maximum 10 characters'],
        trim: true           
     },
     hDegree : {   
        type: String,
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true       
     },
     bloodGroup : {   
        type: String,
        required: [true, "Blood group is required"],
        maxlength: [3, 'Length can be maximum 3 characters'],
        trim: true          
     },
     dobDate:{
        type: String,
        required: [true, "Date of birth is required"],
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     dojDate:{
        type: String,
        required: [true, "Date of joining is required"],
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     district:{
        type: String,
        required: [true, "district is required"],
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true 
     },
     bankName:{
        type: String,
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true 
     },
     bankAccountNo:{
        type: String,
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true 
     },
     emergencyContactName:{
        type: String,
        required: [true, "emergency Contact Name is required"],
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true 
     },
     emergencyContactMobile:{
        type: String,
        required: [true, "emergency Contact no is required"],
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     emergencyContactRelation:{
        type: String,
        required: [true, "Emergency Contact Relation is required"],
        maxlength: [50, 'Length can be maximum 50 characters'],
        trim: true 
     },
   
     basicSalary:{
        type: Number,
        default:0,
        required: [true, "Basic Salary is required"],
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     houseRent:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     medical:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     taDa:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     phoneBill:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     meetingTa:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     meetingDa:{
        type: Number,
        default:0,
        maxlength: [15, 'Length can be maximum 15 characters'],
        trim: true 
     },
     
     status: {   
        type: Boolean,
        default: true},
    },{timestamps: true});
    const Sr= model('Sr',srSchema);
    module.exports=Sr;