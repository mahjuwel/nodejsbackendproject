const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { createDeliveryOrders, updateDeliveryOrders, getAllDeliOrders, getDeliOrderById, deleteDeliveryOrderById, orderDeliveryByChallanNo } = require('../controllers/OrdersDeliveryController');


const orderDeliverRouter= express.Router();



//order deliver management
orderDeliverRouter.post("/", isLoggedIn, createDeliveryOrders);
orderDeliverRouter.put("/", isLoggedIn, updateDeliveryOrders);
orderDeliverRouter.get("/", isLoggedIn, getAllDeliOrders);
orderDeliverRouter.get("/:id", isLoggedIn, getDeliOrderById);
orderDeliverRouter.get("/singleChallan/:challanNo", isLoggedIn, orderDeliveryByChallanNo);
orderDeliverRouter.delete("/:id", isLoggedIn, deleteDeliveryOrderById);

//


module.exports=orderDeliverRouter;