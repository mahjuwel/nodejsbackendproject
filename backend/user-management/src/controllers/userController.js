const csvParser = require('csv-parser');
const fs = require('fs');
const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
// const { deleteImage } = require('../helper/deleteImage');
const { createJSONWEBToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require('../secret');
const emailWithNodeMailer = require('../helper/email');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// Distributor
const bcrypt = require('bcryptjs');
const Distributor = require('../models/dealerModel');
const Sr = require('../models/SrModel');



const createDistributor = async (req, res, next) => {
    try {
        const { distributorName, email, userId, superDBId, creatorId, erpId, password, userRole, crBDTLimit, hasStorage, proprietor, dbOpeningDate, proprietorDOB, address, hasPC, hasPrinter, hasApp, zoneName, regionName, areaName, dbPoint, companyName, phoneNumber, emergencyContactName, emergencyMobileNumber, emergencyContactRelation, unitName } = req.body;

        const newDB = {
            distributorName,
            email,
            userId,
            superDBId,
            creatorId,
            erpId,
            password,
            userRole,
            crBDTLimit,
            hasStorage,
            proprietor,
            dbOpeningDate,
            proprietorDOB,
            address,
            hasPC,
            hasPrinter,
            hasApp,
            zoneName,
            regionName,
            areaName,
            dbPoint,
            companyName,
            phoneNumber,
            emergencyContactName,
            emergencyMobileNumber,
            emergencyContactRelation,
            unitName
        }



        const userExists = await Distributor.exists({ userId: userId });
        if (userExists) {
            throw createError(409, "This Distributor already existed");
        }


        Distributor.create(newDB, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", message: 'Failed! Please try again', data: err })
            }
            else {
                res.status(201).json({ status: "true", message: 'Successfully created', data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}







const createUser = async (req, res, next) => {
    try {
        const { name, email, userId, creatorId, password, designation, zoneName, regionName, areaName, factoryName, companyName, phoneNumber, userRole } = req.body;

        const newUser = {
            name,
            email,
            userId,
            creatorId,
            password,
            designation,
            zoneName,
            regionName,
            areaName,
            factoryName,
            companyName,
            phoneNumber,
            userRole
        }



        const userExists = await User.exists({ userId });
        if (userExists) {
            throw createError(409, "User already existed");
        }


        User.create(newUser, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", "message": "Fails! Try again", data: err })
            }
            else {
                res.status(201).json({ status: "true", "message": "Successfully created", data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}

const getDistributors = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { distributorName: { $regex: searchRegExp } },
                { userId: { $regex: searchRegExp } },
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { userRole: { $regex: searchRegExp } },
                { proprietor: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Distributor.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const distributors = await query.exec();
        const count = await Distributor.find(filter).countDocuments();
        if (!distributors) throw createError(404, "No Order found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Distributors are returned successfully',
            payload: {
                distributors,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }

}

const getDistributorById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const distributor = await findWithId(Distributor, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Distributor is returned successfully',
            payload: { distributor }
        });
    } catch (error) {

        next(error);
    }

}
const getDistributorByDealerId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // const options= {password: 0};  
        const distributorData = await Distributor.findOne({ userId });
        return successResponse(res, {
            statusCode: 200,
            message: 'One Distributor is returned successfully',
            payload: { distributorData }
        });
    } catch (error) {

        next(error);
    }

}
const getDistributorsUnderSDB = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const options= {password: 0};  
        const distributorData = await Distributor.find({superDBId: userId}, options);
        return successResponse(res, {
            statusCode: 200,
            message: 'Distributors under SDB are returned successfully',
            payload: { distributorData }
        });
    } catch (error) {

        next(error);
    }

}

const updateDistributorById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // const options= {password: 0};  
        await findWithId(Distributor, userId);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['distributorName', 'email', 'password', 'distributorType', 'crBDTLimit', 'hasStorage', 'proprietor', 'dbOpeningDate', 'proprietorDOB', 'address', 'hasPC', 'hasPrinter', 'hasApp', 'zoneName', 'regionName', 'areaName', 'companyName', 'phoneNumber', 'emergencyContactName', 'emergencyMobileNumber', 'emergencyContactRelation', 'unitName'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['dealerId'].includes(key)) {
                throw createError(400, 'Distributor Id can not be updated');
            }
        }

        const updatedUser = await Distributor.findByIdAndUpdate(userId, updates, updateOptions);
        if (!updatedUser) {
            throw createError(400, 'Distributor with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Distributor was updated successfully',
            payload: { updatedUser },
        });
    } catch (error) {

        next(error);
    }

}

const deleteDistributorById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const distributor = await findWithId(Distributor, id);
        await Distributor.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { distributor },
            message: 'Distributor was deleted successfully',
        });
    } catch (error) {

        next(error); 1
    }

}

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {

            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phoneNumber: { $regex: searchRegExp } },
                { userId: { $regex: searchRegExp } },
                { userRole: { $regex: searchRegExp } },
                { designation: { $regex: searchRegExp } },
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },


            ]
        };
        const options = { password: 0 }
        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await User.find(filter).countDocuments();
        if (!users) throw createError(404, "No users found!");
        return successResponse(res, {
            statusCode: 200,
            message: 'users are returned successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                }

            }
        });
    } catch (error) {
        next(error);
    }

}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const user = await findWithId(User, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'user is returned successfully',
            payload: { user }
        });
    } catch (error) {

        next(error);
    }

}
const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // const options= {password: 0};  
        await findWithId(User, userId);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['name', 'email', 'password', 'designation', 'zoneName', 'regionName', 'areaName', 'companyName', 'phoneNumber', 'userRole', 'isBanned'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['userId'].includes(key)) {
                throw createError(400, 'User Id can not be updated');
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions);
        if (!updatedUser) {
            throw createError(400, 'User with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'user was updated successfully',
            payload: { updatedUser },
        });
    } catch (error) {

        next(error);
    }

}
const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const user = await findWithId(User, id);
        await User.findOneAndDelete({ _id: id, userRole: { $nin: ['Admin', 'Super Admin'] } });
        return successResponse(res, {
            statusCode: 200,
            payload: { user },
            message: 'user was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}

const multiDBUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        // Parse uploaded CSV file
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async() => {
                // Once parsing is done, send back the parsed data
              
                await Distributor.insertMany(results);
                res.json({ success: true, "message": "Successfully uploaded"});
                console.log('csv data: ', results);
            });
    } catch (error) {
        console.log("csv error: ", error);
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {

        const token = req.body.token;
        if (!token) throw createError(404, "Token not found!");
        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) throw createError(401, "Unable to verify user!");
            const userExists = await User.exists({ email: decoded.email });
            if (userExists) {
                throw createError(409, "User already existed. Please sign in");
            }
            await User.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: `User was registered successfully`,

            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw createError(401, 'Invalid Token');
            } else {
                throw error;
            }
        }

    } catch (error) {

        next(error);
    }

}

const handleBanUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: true };
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");
        if (!updatedUser) {
            throw createError(400, 'User was not banned');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'user was successfully banned'
        });
    } catch (error) {

        next(error);
    }

}
const handleUnbanUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: false };
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");
        if (!updatedUser) {
            throw createError(400, 'User was not unbanned');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'user was successfully unbanned'
        });
    } catch (error) {

        next(error);
    }
}
const handleUpdatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.id;
        const user = await findWithId(User, userId);
        const isPasswirdMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswirdMatch) {
            throw createError(401, "Old password is not correct..");
        }

        // const filter={userId};
        // const updates= {$set: {password: newPassword}};      
        // const updateOptions= {new: true, runValidators: true, context: 'query'}; 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: newPassword },
            { new: true }
        ).select("-password");
        if (!updatedUser) {
            throw createError(400, 'Password was not updated');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'user password was successfully updated',
            payload: user
        });
    } catch (error) {

        next(error);
    }
}
const handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw createError(404, "Email is incorrect. You have not verified your email address. Please register.");
        }

        const token = createJSONWEBToken({ email }, jwtResetPasswordKey, '10m');
        //prepare email
        const emailData = {
            email,
            subject: 'Reset Password of Email',
            html: `
           <h2>Hello ${userData.name}</h2> 
           <p>Please click here to<a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> reset your password of email</a></p>       
         `
        }
        try {

            await emailWithNodeMailer(emailData);

        } catch (Emailerror) {
            next(createError(5000, "Failed to send verification email"));
            return
        }
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email}  and complete your reset password process.`,
            payload: { token }
        });
    } catch (error) {

        next(error);
    }
}
const handleResetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, jwtResetPasswordKey);
        if (!decoded) {
            throw createError(400, "Invalid or expired token");
        }
        const filter = { email: decoded.email };
        const update = { password: password };
        const options = { new: true };
        const updateUser = await User.findOneAndUpdate(
            filter,
            update,
            options
        ).select('-password');
        if (!updateUser) {
            throw createError(400, "Reset password was not successfully reset.");
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'password was successfully reset'
        });
    } catch (error) {

        next(error);
    }
}

const createSR = async (req, res, next) => {
    try {
        const { companyName, zoneName, regionName, areaName, dbPoint, dealerId, dealerName, srName, userRole, userId, password, email,
            mobileNo, sscYear, hDegree, bloodGroup, dobDate, dojDate, district, bankName, bankAccountNo, emergencyContactName,
            emergencyContactMobile, emergencyContactRelation, basicSalary, houseRent, medical, taDa, phoneBill, meetingTa, meetingDa } = req.body;

        const newSR = {
            companyName,
            zoneName,
            regionName,
            areaName,
            dbPoint,
            dealerId,
            dealerName,
            srName,
            userRole,
            userId,
            password,
            email,
            mobileNo,
            sscYear,
            hDegree,
            bloodGroup,
            dobDate,
            dojDate,
            district,
            bankName,
            bankAccountNo,
            emergencyContactName,
            emergencyContactMobile,
            emergencyContactRelation,
            basicSalary,
            houseRent,
            medical,
            taDa,
            phoneBill,
            meetingTa,
            meetingDa
        }



        const srExists = await Sr.exists({ userId });
        if (srExists) {
            throw createError(409, "This SR already existed");
        }


        Sr.create(newSR, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", "message": "Fails! Try again", data: err })
            }
            else {
                res.status(201).json({ status: "true", "message": "Successfully created", data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}


module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    createUser,
    createDistributor,
    getDistributors,
    getDistributorById,
    updateDistributorById,
    deleteDistributorById,
    getDistributorByDealerId,
    activateUserAccount,
    updateUserById,
    multiDBUpload,
    handleBanUserById,
    handleUnbanUserById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
    getDistributorsUnderSDB
}