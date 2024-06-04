const express = require("express");
const { createProductBrand,
    updateProductBrand,
    productBrandGetById,
    getAllProductBrand,
    productBrandDelete } = require("../controllers/productBrandController");
const { validateProductBrandCreate } = require("../validators/productBrand");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const ProductBrandRouter = express.Router();


ProductBrandRouter.get('/:id', isLoggedIn, productBrandGetById)
ProductBrandRouter.patch('/:id', isLoggedIn, isAdmin, validateProductBrandCreate, updateProductBrand)
ProductBrandRouter.delete('/:id', isLoggedIn, isAdmin, productBrandDelete)
ProductBrandRouter.post('/', isLoggedIn, isAdmin, validateProductBrandCreate, createProductBrand)
ProductBrandRouter.get('/', isLoggedIn, getAllProductBrand)

module.exports = ProductBrandRouter;