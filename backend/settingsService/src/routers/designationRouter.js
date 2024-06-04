const express = require("express");
const { createDesignation,
    updateDesignation,
    designationGetById,
    getAllDesignation,
    designationDelete } = require("../controllers/designationController");
const { validateDesignationCreate } = require("../validators/designation");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const DesignationRouter = express.Router();



DesignationRouter.get('/:id', isLoggedIn, designationGetById)
DesignationRouter.patch('/:id', isLoggedIn, isAdmin, validateDesignationCreate, updateDesignation)
DesignationRouter.delete('/:id', isLoggedIn, isAdmin, designationDelete)
DesignationRouter.post('/', isLoggedIn, isAdmin, validateDesignationCreate, createDesignation)
DesignationRouter.get('/', isLoggedIn, getAllDesignation)

module.exports = DesignationRouter;