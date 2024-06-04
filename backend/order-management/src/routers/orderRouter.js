const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createProduct, isAdmin, getProducts, getProductById, updateProductById, deleteUserById, createOrder, updateOrder, getAllOrders, getOrderById, deleteOrderById, getOrderByDoNo, getOrderByDBID, deleteOrderByDoNo, getPendingOrders, getAllOrdersGroupBydoNo, getCheckOrders, getAuthorizeOrders, getPaymentConfirmOrders, getApprovedOrders, getOrderByMultiDbId, createOfferProduct, updateOfferProductById, getOfferProductById, deleteOfferProductById } = require('../controllers/orderManagement');
const orderRouter= express.Router();

//product management

orderRouter.post("/create-product", isLoggedIn, isAdmin, createProduct);
orderRouter.get("/products", isLoggedIn, isAdmin, getProducts);
orderRouter.get("/one-product/:id", isLoggedIn, isAdmin, getProductById);
orderRouter.put("/update-product/:id", isLoggedIn, isAdmin, updateProductById);
orderRouter.delete("/delete-product/:id", isLoggedIn, isAdmin, deleteUserById);

//order management
orderRouter.post("/create", isLoggedIn, createOrder);
orderRouter.put("/", isLoggedIn, updateOrder);
orderRouter.get("/", isLoggedIn, getAllOrders);
orderRouter.get("/pending", isLoggedIn, getPendingOrders);
orderRouter.get("/check", isLoggedIn, getCheckOrders);
orderRouter.get("/authorize", isLoggedIn, getAuthorizeOrders);
orderRouter.get("/confirm", isLoggedIn, getPaymentConfirmOrders);
orderRouter.get("/approved", isLoggedIn, getApprovedOrders);
orderRouter.get("/group", isLoggedIn, getAllOrdersGroupBydoNo);
orderRouter.get("/:id", isLoggedIn, getOrderById);
orderRouter.get("/singleOrder/:doNo", isLoggedIn, getOrderByDoNo);
orderRouter.get("/dbOrders/:dbId", isLoggedIn, getOrderByDBID);
orderRouter.post("/moredbOrders", isLoggedIn, getOrderByMultiDbId);
orderRouter.post("/createOfferProduct", isLoggedIn, createOfferProduct);
orderRouter.put("/createOfferProduct/:id", isLoggedIn, updateOfferProductById);
orderRouter.get("/createOfferProduct/:id", isLoggedIn, getOfferProductById);
orderRouter.delete("/createOfferProduct/:id", isLoggedIn, deleteOfferProductById);


orderRouter.delete("/:id", isLoggedIn, deleteOrderById);
orderRouter.delete("/delete/:doNo", isLoggedIn, deleteOrderByDoNo);
//



module.exports=orderRouter;