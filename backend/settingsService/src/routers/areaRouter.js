const express = require("express");
const { createArea, getAllAreas, areaGetById, updateArea, areaDelete } = require("../controllers/areaController");
const { validateAreaCreate, validateAreaUpdate } = require("../validators/area");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const areaRouter = express.Router();

areaRouter.delete('/:id', isLoggedIn, isAdmin, areaDelete)
areaRouter.patch('/:id', isLoggedIn, isAdmin, validateAreaUpdate, updateArea)
areaRouter.get('/:id', isLoggedIn, areaGetById)
areaRouter.post('/', isLoggedIn, isAdmin, validateAreaCreate, createArea)
areaRouter.get('/', isLoggedIn, getAllAreas)




module.exports = areaRouter;