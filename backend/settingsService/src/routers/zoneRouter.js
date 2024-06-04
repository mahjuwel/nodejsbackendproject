const express = require("express");
const { createZone, getAllZones, updateZone, zoneGetById, deleteZone } = require("../controllers/zoneController");
const { validateZoneCreate } = require("../validators/zone");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const zoneRouter = express.Router();


zoneRouter.get('/:id', isLoggedIn, validateZoneCreate, zoneGetById)
zoneRouter.patch('/:id', isLoggedIn, isAdmin, updateZone)
zoneRouter.delete('/:id', isLoggedIn, isAdmin, deleteZone)
zoneRouter.post('/', isLoggedIn, isAdmin, validateZoneCreate, createZone)
zoneRouter.get('/', isLoggedIn, getAllZones)

module.exports = zoneRouter;