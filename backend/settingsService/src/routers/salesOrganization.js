const express = require("express");
const { createSalesOrganization,
    updateSalesOrganization,
    salesOrganizationGetById,
    getAllSalesOrganization,
    salesOrganizationDelete } = require("../controllers/salesOrganizationController");
const { validateSalesOrganizationCreate } = require("../validators/salesOrganization");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const salesOrganizationRouter = express.Router();


salesOrganizationRouter.delete('/:id', isLoggedIn, isAdmin, salesOrganizationDelete)
salesOrganizationRouter.patch('/:id', isLoggedIn, isAdmin, validateSalesOrganizationCreate, updateSalesOrganization)
salesOrganizationRouter.get('/:id', isLoggedIn, salesOrganizationGetById)
salesOrganizationRouter.post('/', isLoggedIn, isAdmin, validateSalesOrganizationCreate, createSalesOrganization)
salesOrganizationRouter.get('/', isLoggedIn, getAllSalesOrganization)


module.exports = salesOrganizationRouter;