const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
// const { findWithId } = require('../services/findItem');
const jwt= require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const { jwtAccessKey} = require('../secret');
const Distributor = require('../models/dealerModel');


const handleLogin= async(req, res, next) =>{
try {
 const {userId, password} = req.body;
 

 const user = await User.findOne({userId, password});
 if(!user){
 throw createError(404," Your ID or Password is wrong! Please try again");
 }

 if(user.isBanned){
    throw createError(403,"You are banned. Please contact the administrator");
 }


 const userWithoutPassword= await User.findOne({userId}).select("-password");
 return successResponse(res,{
    statusCode:200,
    message: 'Loggedin successfully',    
    payload: {token:jwt.sign({
      data: userWithoutPassword
    }, jwtAccessKey, { expiresIn: '24h' })},
   

});

} catch (error) {
 next(error); 
}
}


const DBHandleLogin= async(req, res, next) =>{
   try {
    const {userId, password} = req.body;
    
    const dealer = await Distributor.findOne({userId, password});
  
    if(!dealer){
    throw createError(404," Your ID or Password is wrong! Please try again");
    }
   
    if(!dealer.status){
       throw createError(403,"You are inactive. Please contact the administrator");
    }
   
// console.log("user Id",userId);
    const dealerWithoutPassword= await Distributor.findOne({userId}).select("-password");
    return successResponse(res,{
       statusCode:200,
       message: 'Loggedin successfully',
       payload: {token:jwt.sign({
         data: dealerWithoutPassword
       }, jwtAccessKey, { expiresIn: '24h' })},
   });
   
   } catch (error) {
    next(error); 
   }
   }




const handleLogout= async(req, res, next) =>{
    try {
    res.clearCookie('accessToken');
     return successResponse(res,{
        statusCode:200,
        message: 'User loggedout successfully',
        payload: { }
    });
    
    } catch (error) {
     next(error); 
    }
    }
    const isAdmin= async(req, res, next) =>{
      try {
      const userRole= req.body.accessRole;
      if(userRole!='Admin'){
       throw createError(403,"You are not allowed to access this data");
      }
      
      next();
      
      } catch (error) {
       next(error); 
      }
      }

 
module.exports={
    handleLogin,
    DBHandleLogin,
    handleLogout,
    isAdmin
}