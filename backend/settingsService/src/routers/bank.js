const express = require("express");
const { createBank,
    updateBank,
    bankGetById,
    getAllBanks,
    bankDelete } = require("../controllers/bankController");
const { validateBankCreate, validateBankUpdate } = require("../validators/bank");
const { isLoggedIn } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const bankRouter = express.Router();

bankRouter.delete('/:id', isLoggedIn, isAdmin, bankDelete)
bankRouter.patch('/:id', isLoggedIn, isAdmin, validateBankUpdate, updateBank)
bankRouter.get('/:id', isLoggedIn, bankGetById)
bankRouter.post('/', isLoggedIn, isAdmin, validateBankCreate, createBank)
bankRouter.get('/', isLoggedIn, getAllBanks)


module.exports = bankRouter;