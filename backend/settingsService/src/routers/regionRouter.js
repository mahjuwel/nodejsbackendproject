const express = require("express");
const { createRegion, getAllRegions, regionGetById, updateRegion, regionDelete } = require("../controllers/regionController");
const { validateRegionCreate, validateRegionUpdate } = require("../validators/region");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const regionRouter = express.Router();

regionRouter.delete('/:id', isLoggedIn, isAdmin, regionDelete)
regionRouter.patch('/:id', isLoggedIn, isAdmin, validateRegionUpdate, updateRegion)
regionRouter.get('/:id', isLoggedIn, regionGetById)
regionRouter.post('/', isLoggedIn, isAdmin, validateRegionCreate, createRegion)
regionRouter.get('/', isLoggedIn, getAllRegions)

module.exports = regionRouter;