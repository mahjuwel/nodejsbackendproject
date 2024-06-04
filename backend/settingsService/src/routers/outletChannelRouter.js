const express = require("express");
const { createOutletChannel,
    updateOutletChannel,
    outletChannelGetById,
    getAllOutletChannel,
    outletChannelDelete } = require("../controllers/outletChannelController");
const { validateOutletChannelCreate } = require("../validators/outletChannel");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const OutletChannelRouter = express.Router();



OutletChannelRouter.get('/:id', isLoggedIn, outletChannelGetById)
OutletChannelRouter.patch('/:id', isLoggedIn, isAdmin, validateOutletChannelCreate, updateOutletChannel)
OutletChannelRouter.delete('/:id', isLoggedIn, isAdmin, outletChannelDelete)
OutletChannelRouter.post('/', isLoggedIn, isAdmin, validateOutletChannelCreate, createOutletChannel)
OutletChannelRouter.get('/', isLoggedIn, getAllOutletChannel)

module.exports = OutletChannelRouter;