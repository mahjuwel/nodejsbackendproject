const express= require('express');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const { createProduct, isAdmin, getProducts, getProductById, updateProductById, deleteUserById } = require('../controllers/orderManagement');
const productRouter= express.Router();

//product management

productRouter.post("/create", isLoggedIn, isAdmin, createProduct);
productRouter.get("/", isLoggedIn, getProducts);
productRouter.get("/:id", isLoggedIn, getProductById);
productRouter.put("/:id", isLoggedIn, isAdmin, updateProductById);
productRouter.delete("/:id", isLoggedIn, isAdmin, deleteUserById);

//order management
// orderRouter.post("/create", isLoggedIn, createOrder);
// orderRouter.put("/", isLoggedIn, updateOrder);
// orderRouter.get("/all", isLoggedIn, getAllOrders);
// orderRouter.get("/:id", isLoggedIn, getOrderById);
// orderRouter.delete("/:id", isLoggedIn, deleteOrderById);

//


module.exports=productRouter;