const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createOrderWithBank, updateOrderWithBank, getAllOrdersWithBank, deleteOrderBankById, getOrderBankById, getPaymentOrderByDoNo, getPaymentOrderByDBID } = require('../controllers/orderManagement');
const orderWithBank= express.Router();



//order management
orderWithBank.post("/create", isLoggedIn, createOrderWithBank);
orderWithBank.put("/:id", isLoggedIn, updateOrderWithBank);
orderWithBank.get("/", isLoggedIn, getAllOrdersWithBank);
orderWithBank.get("/:id", isLoggedIn, getOrderBankById);
orderWithBank.get("/payInfo/:doNo", isLoggedIn, getPaymentOrderByDoNo);
orderWithBank.get("/db/payInfo/:dbId",isLoggedIn,getPaymentOrderByDBID);
//getPaymentOrderByDoNo
orderWithBank.delete("/:id", isLoggedIn, deleteOrderBankById);

//


module.exports=orderWithBank;