const express = require("express");
const { getAreas, getAreasbyRegion } = require("../controllers/areaController");
const { validateAreaCreate, validateAreaUpdate } = require("../validators/area");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const areasRouter = express.Router();

areasRouter.get('/', isLoggedIn, getAreas)
areasRouter.get('/:regionName', isLoggedIn,getAreasbyRegion)
//getAreasbyRegion


module.exports = areasRouter;