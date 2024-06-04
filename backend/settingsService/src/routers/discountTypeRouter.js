const express = require("express");
const { createDiscountType,
    updateDiscountType,
    discountTypeGetById,
    getAllDiscountTypes,
    discountTypeDelete } = require("../controllers/discountTypeController");
const { validateOfferTypeCreate } = require("../validators/offerType");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const DiscountTypeRouter = express.Router();



DiscountTypeRouter.get('/:id', isLoggedIn, discountTypeGetById)
DiscountTypeRouter.patch('/:id', isLoggedIn, isAdmin, validateOfferTypeCreate, updateDiscountType)
DiscountTypeRouter.delete('/:id', isLoggedIn, isAdmin, discountTypeDelete)
DiscountTypeRouter.post('/', isLoggedIn, isAdmin, validateOfferTypeCreate, createDiscountType)
DiscountTypeRouter.get('/', isLoggedIn, getAllDiscountTypes)

module.exports = DiscountTypeRouter;