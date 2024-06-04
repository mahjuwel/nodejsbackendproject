const express = require("express");
const { createOfferType,
    updateOfferType,
    offerTypeGetById,
    getAllOfferType,
    offerTypeDelete } = require("../controllers/offerTypeController");
const { validateOfferTypeCreate } = require("../validators/offerType");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const OfferTypeRouter = express.Router();



OfferTypeRouter.get('/:id', isLoggedIn, offerTypeGetById)
OfferTypeRouter.patch('/:id', isLoggedIn, isAdmin, validateOfferTypeCreate, updateOfferType)
OfferTypeRouter.delete('/:id', isLoggedIn, isAdmin, offerTypeDelete)
OfferTypeRouter.post('/', isLoggedIn, isAdmin, validateOfferTypeCreate, createOfferType)
OfferTypeRouter.get('/', isLoggedIn, getAllOfferType)

module.exports = OfferTypeRouter;