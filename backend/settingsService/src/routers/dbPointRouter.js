const express = require("express");
const { createDbPoint, updateDbPoint, deleteDbPoint, getAllDbPoint, dbPointGetById } = require("../controllers/dbPointController");
const { validateDbPointCreate } = require("../validators/dbPoint");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const dbPointRouter = express.Router();


dbPointRouter.get('/:id', isLoggedIn, validateDbPointCreate, dbPointGetById)
dbPointRouter.patch('/:id', isLoggedIn, isAdmin, updateDbPoint)
dbPointRouter.delete('/:id', isLoggedIn, isAdmin, deleteDbPoint)
dbPointRouter.post('/', isLoggedIn, isAdmin, validateDbPointCreate, createDbPoint)
dbPointRouter.get('/', isLoggedIn, getAllDbPoint)

module.exports = dbPointRouter;