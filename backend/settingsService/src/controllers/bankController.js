const { validationResult } = require("express-validator");
const Banks = require("../models/bankModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createBank = async (req, res, next) => {
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
        const result = await Banks.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Bank created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateBank = async (req, res, next) => {
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

        const result = await Banks.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Bank not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Bank updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const bankGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Banks.findById(id);
    if (!result) {
        throw createError(404, "Bank not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Bank returned successfully',
        payload: {
            result
        }
    });
}

const getAllBanks = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { salesOrgName: { $regex: searchRegExp }, bankName: { $regex: searchRegExp } }
            ]
        };
        const result = await Banks.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await Banks.find(filter).countDocuments();
        if (!result) throw createError(404, "No Banks found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Banks are returned successfully',
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

const bankDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await Banks.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Bank not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Bank delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createBank,
    updateBank,
    bankGetById,
    getAllBanks,
    bankDelete
}