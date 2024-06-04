const { validationResult } = require("express-validator");
const Designation = require("../models/designationModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createDesignation = async (req, res, next) => {
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
        const result = await Designation.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Designation created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateDesignation = async (req, res, next) => {
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

        const result = await Designation.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Designation not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Designation updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const designationGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Designation.findById(id);
    if (!result) {
        throw createError(404, "Designation not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Designation returned successfully',
        payload: {
            result
        }
    });
}

const getAllDesignation = async (req, res, next) => {
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
        const result = await Designation.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await Designation.find(filter).countDocuments();
        if (!result) throw createError(404, "No Designation found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Designation are returned successfully',
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

const designationDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await Designation.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Designation not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Designation delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createDesignation,
    updateDesignation,
    designationGetById,
    getAllDesignation,
    designationDelete
}