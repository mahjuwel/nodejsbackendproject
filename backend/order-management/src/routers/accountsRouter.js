const express = require('express');
// const upload = require('../middlewares/uploadFile');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { makeDeposit, getDeposits, getDepositById, updateDepositById, deleteDepositById, getDepositByDBID, getDepositByDealerId, multiUpdateDeposit } = require('../controllers/AccountsController');
const accountsRouter = express.Router();



//order management
accountsRouter.post("/create", isLoggedIn, makeDeposit);
accountsRouter.get("/deposits", isLoggedIn, getDeposits);
accountsRouter.get("/dealer/deposit/:dealerId", isLoggedIn, getDepositByDealerId);
accountsRouter.put("/deposit/multiupdate", isLoggedIn, multiUpdateDeposit);
//
//
accountsRouter.put("/deposit/:id", isLoggedIn, updateDepositById);
accountsRouter.get("/deposit/:id", isLoggedIn, getDepositById);
accountsRouter.get("/db/deposit/:dbId", isLoggedIn, getDepositByDBID);
accountsRouter.delete("/deposit/:id", isLoggedIn, deleteDepositById);

//


module.exports = accountsRouter;