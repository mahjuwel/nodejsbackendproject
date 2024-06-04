const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { getOfferProducts } = require('../controllers/orderManagement');

const offerProductRoute= express.Router();

offerProductRoute.get("/", isLoggedIn, getOfferProducts);



module.exports=offerProductRoute;