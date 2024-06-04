const express = require("express");
const { createDistributorType,
    updateDistributorType,
    distributorTypeGetById,
    getAllDistributorTypes,
    distributorTypeDelete } = require("../controllers/distributorTypeController");
const { validateDistributorTypeCreate } = require("../validators/distributorType");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const DistributorTypeRouter = express.Router();



DistributorTypeRouter.get('/:id', isLoggedIn, distributorTypeGetById)
DistributorTypeRouter.patch('/:id', isLoggedIn, isAdmin, validateDistributorTypeCreate, updateDistributorType)
DistributorTypeRouter.delete('/:id', isLoggedIn, isAdmin, distributorTypeDelete)
DistributorTypeRouter.post('/', isLoggedIn, isAdmin, validateDistributorTypeCreate, createDistributorType)
DistributorTypeRouter.get('/', isLoggedIn, getAllDistributorTypes)

module.exports = DistributorTypeRouter;