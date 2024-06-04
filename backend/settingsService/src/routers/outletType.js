const express = require("express");
const { createOutletType,
    updateOutletType,
    outletTypeGetById,
    getAllOutletType,
    outletTypeDelete } = require("../controllers/outletTypeController");
const { validateOutletTypeCreate } = require("../validators/outletType");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const OutletTypeRouter = express.Router();



OutletTypeRouter.get('/:id', isLoggedIn, outletTypeGetById)
OutletTypeRouter.patch('/:id', isLoggedIn, isAdmin, validateOutletTypeCreate, updateOutletType)
OutletTypeRouter.delete('/:id', isLoggedIn, isAdmin, outletTypeDelete)
OutletTypeRouter.post('/', isLoggedIn, isAdmin, validateOutletTypeCreate, createOutletType)
OutletTypeRouter.get('/', isLoggedIn, getAllOutletType)

module.exports = OutletTypeRouter;