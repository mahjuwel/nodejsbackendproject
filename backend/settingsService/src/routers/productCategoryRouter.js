const express = require("express");
const { createProductCategory,
    updateProductCategory,
    productCategoryGetById,
    getAllProductCategory,
    productCategoryDelete, 
    allCategoryProduct,
    categoryWiseOrderProducts} = require("../controllers/productCategoryController");
const { validateProductCategoryCreate } = require("../validators/productCategory");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const ProductCategoryRouter = express.Router();



ProductCategoryRouter.get('/:id', isLoggedIn, productCategoryGetById)
ProductCategoryRouter.patch('/:id', isLoggedIn, isAdmin, validateProductCategoryCreate, updateProductCategory)
ProductCategoryRouter.delete('/:id', isLoggedIn, isAdmin, productCategoryDelete)
ProductCategoryRouter.post('/', isLoggedIn, isAdmin, validateProductCategoryCreate, createProductCategory)
ProductCategoryRouter.get('/', isLoggedIn, getAllProductCategory)
ProductCategoryRouter.get('/all/prods', isLoggedIn, allCategoryProduct)
ProductCategoryRouter.get('/all/catwiseProducts/:catType', isLoggedIn, categoryWiseOrderProducts)
//

module.exports = ProductCategoryRouter;