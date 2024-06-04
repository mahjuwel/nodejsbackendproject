const express= require('express');
const multer = require('multer');
const { getUsers, getUserById, deleteUserById, createUser, createDistributor, activateUserAccount, updateUserById, handleBanUserById, handleUnbanUserById, handleUpdatePassword, handleForgetPassword, handleResetPassword, getDistributors, getDistributorById, updateDistributorById, deleteDistributorById, getDistributorByDealerId, multiDBUpload, getDistributorsUnderSDB} = require('../controllers/userController');

const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateUserResetPassword } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { isAdmin } = require('../controllers/authController');
const userRouter= express.Router();


// userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/allUsers", isLoggedIn, getUsers);
// userRouter.post("/process-register",upload.single('image'),isLoggedOut,validateUserRegistration,runValidation,processRegister);
userRouter.post("/create-user", isLoggedIn, isAdmin, createUser);
userRouter.post("/create-db", isLoggedIn, isAdmin, createDistributor);
userRouter.get("/allDistributors", isLoggedIn, getDistributors);


userRouter.get("/distributor/:id", getDistributorById);
userRouter.get("/dealer/:userId", getDistributorByDealerId);
userRouter.put("/distributor/:id", updateDistributorById);
userRouter.delete("/distributor/:id", deleteDistributorById);
userRouter.get("/dbsUnderSdb/:userId", isLoggedIn, getDistributorsUnderSDB);
// userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.get("/:id", getUserById);

userRouter.put("/:id",  updateUserById);
// userRouter.put("/:id",upload.single('image'), isLoggedIn, updateUserById);
// userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.delete("/:id", deleteUserById);
       
userRouter.post("/activate", isLoggedOut, activateUserAccount);

userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/reset-password",
 validateUserResetPassword,
 runValidation,
 handleResetPassword);


 // Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Use the original file name
    }
  });
  
const upload = multer({ storage: storage })
userRouter.post("/dbs/upload", isLoggedIn, isAdmin, upload.single('csvFile'), multiDBUpload);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnbanUserById);

//
userRouter.put("/update-password/:id", isLoggedIn, validateUserPasswordUpdate, runValidation, handleUpdatePassword);
userRouter.post("/forget-password", validateUserForgetPassword, runValidation, handleForgetPassword);


module.exports=userRouter;