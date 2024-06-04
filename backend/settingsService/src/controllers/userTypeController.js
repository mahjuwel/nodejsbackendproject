const { validationResult } = require("express-validator");
const UserType = require("../models/userTypeModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createUserType = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, {
                statusCode: status.NOT_ACCEPTABLE,
                success: 'false',
                message: errors.array(),
            })
        }

        const { ...data } = req.body;
        const result = await UserType.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'User Type created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateUserType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, {
                statusCode: status.NOT_ACCEPTABLE,
                success: 'false',
                message: errors.array(),
            });
        }

        const result = await UserType.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "User Type not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'User Type updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const userTypeGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await UserType.findById(id);
    if (!result) {
        throw createError(404, "User Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'User Type returned successfully',
        payload: {
            result
        }
    });
}

const getAllUserType = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } }
            ]
        };
        const result = await UserType.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await UserType.find(filter).countDocuments();
        if (!result) throw createError(404, "No user type found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'user type are returned successfully',
            payload: {
                result,
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

const userTypeDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await UserType.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "user Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'User Type delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createUserType,
    updateUserType,
    userTypeGetById,
    getAllUserType,
    userTypeDelete
}