const { validationResult } = require("express-validator");
const OutletTarget = require("../models/outletTargetModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createOutletTarget = async (req, res, next) => {
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
        const result = await OutletTarget.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Target created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateOutletTarget = async (req, res, next) => {
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

        const result = await OutletTarget.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Outlet Target not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Target updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const outletTargetGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletTarget.findById(id);
    if (!result) {
        throw createError(404, "Outlet Target not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet Target returned successfully',
        payload: {
            result
        }
    });
}

const getAllOutletTarget = async (req, res, next) => {
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
        const result = await OutletTarget.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await OutletTarget.find(filter).countDocuments();
        if (!result) throw createError(404, "No Outlet Target found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Target are returned successfully',
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

const outletTargetDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletTarget.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Outlet Target not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet Target delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createOutletTarget,
    updateOutletTarget,
    outletTargetGetById,
    getAllOutletTarget,
    outletTargetDelete
}