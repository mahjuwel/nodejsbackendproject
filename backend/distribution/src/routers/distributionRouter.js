const express= require('express');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { createSchedule, updateSchedule, getAllSchedules, getScheduleById, deleteOrderSkuById } = require('../controllers/distributionController');

const distributionRouter= express.Router();



//schedule management
distributionRouter.post("/", isLoggedIn, createSchedule);
distributionRouter.put("/", isLoggedIn, updateSchedule);
distributionRouter.get("/", isLoggedIn, getAllSchedules);
distributionRouter.get("/:id", isLoggedIn, getScheduleById);
distributionRouter.delete("/:id", isLoggedIn, deleteOrderSkuById);




module.exports=distributionRouter;