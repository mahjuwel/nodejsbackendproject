const express= require('express');

const { handleLogin, handleLogout, DBHandleLogin } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { validateUserLogin, validateDBLogin } = require('../validators/auth');
const runValidation = require('../validators');
const authRouter= express.Router();

authRouter.post("/login", validateUserLogin, runValidation, handleLogin);
authRouter.post("/dbLogin", validateDBLogin, runValidation, DBHandleLogin);

authRouter.post("/logout",isLoggedIn, handleLogout);




module.exports=authRouter;

