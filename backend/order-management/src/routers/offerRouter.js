const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createOffer, getOffers, getOfferById, updateOfferById, deleteOfferById, getOfferQtyValueSum } = require('../controllers/offerDiscountController');
const offerRouter= express.Router();

//offer management
offerRouter.post("/create", isLoggedIn, createOffer);
offerRouter.get("/", isLoggedIn, getOffers);
offerRouter.get("/:id", isLoggedIn, getOfferById);
offerRouter.put("/:id", isLoggedIn, updateOfferById);
offerRouter.delete("/:id", isLoggedIn, deleteOfferById);
offerRouter.post("/OfferQtyValueSum", isLoggedIn, getOfferQtyValueSum);
//


module.exports=offerRouter;