const express = require("express");
const { createOutletTarget,
    updateOutletTarget,
    outletTargetGetById,
    getAllOutletTarget,
    outletTargetDelete } = require("../controllers/outletTargetController");
const { validateOutletTargetCreate } = require("../validators/outletTarget");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const OutletTargetRouter = express.Router();



OutletTargetRouter.get('/:id', isLoggedIn, outletTargetGetById)
OutletTargetRouter.patch('/:id', isLoggedIn, isAdmin, validateOutletTargetCreate, updateOutletTarget)
OutletTargetRouter.delete('/:id', isLoggedIn, isAdmin, outletTargetDelete)
OutletTargetRouter.post('/', isLoggedIn, isAdmin, validateOutletTargetCreate, createOutletTarget)
OutletTargetRouter.get('/', isLoggedIn, getAllOutletTarget)

module.exports = OutletTargetRouter;