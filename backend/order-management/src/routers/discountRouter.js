const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createDiscount, getDiscounts, getDiscountById, updateDiscountById, deleteDiscountById } = require('../controllers/offerDiscountController');
const discountRouter= express.Router();

//offer management
discountRouter.post("/create", isLoggedIn, createDiscount);
discountRouter.get("/", isLoggedIn, getDiscounts);
discountRouter.get("/:id", isLoggedIn, getDiscountById);
discountRouter.put("/:id", isLoggedIn, updateDiscountById);
discountRouter.delete("/:id", isLoggedIn, deleteDiscountById);


module.exports=discountRouter;