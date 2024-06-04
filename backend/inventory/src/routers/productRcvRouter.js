const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createRcvProducts, updateRcvProducts, getAllRcvProducts, getRcvProductById, deleteProductRcvById, createOfferRcvProducts } = require('../controllers/ProductRcvController');
const productsRcv= express.Router();



//order management
productsRcv.post("/", isLoggedIn, createRcvProducts);
productsRcv.post("/createOfferRcvProducts", isLoggedIn, createOfferRcvProducts);
//
productsRcv.put("/", isLoggedIn, updateRcvProducts);
productsRcv.get("/", isLoggedIn, getAllRcvProducts);
productsRcv.get("/:id", isLoggedIn, getRcvProductById);
productsRcv.delete("/:id", isLoggedIn, deleteProductRcvById);

//


module.exports=productsRcv;