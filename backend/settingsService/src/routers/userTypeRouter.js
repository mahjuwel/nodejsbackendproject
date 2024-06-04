const express = require("express");
const { createUserType,
    updateUserType,
    userTypeGetById,
    getAllUserType,
    userTypeDelete } = require("../controllers/userTypeController");
const { validateUserTypeCreate } = require("../validators/userType");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const UserTypeRouter = express.Router();


UserTypeRouter.get('/:id', isLoggedIn, userTypeGetById)
UserTypeRouter.patch('/:id', isLoggedIn, isAdmin, validateUserTypeCreate, updateUserType)
UserTypeRouter.delete('/:id', isLoggedIn, isAdmin, userTypeDelete)
UserTypeRouter.post('/', isLoggedIn, isAdmin, validateUserTypeCreate, createUserType)
UserTypeRouter.get('/', isLoggedIn, getAllUserType)

module.exports = UserTypeRouter;