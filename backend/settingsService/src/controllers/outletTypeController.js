const { validationResult } = require("express-validator");
const OutletType = require("../models/outletTypeModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createOutletType = async (req, res, next) => {
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
        const result = await OutletType.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Type created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateOutletType = async (req, res, next) => {
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

        const result = await OutletType.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Outlet Type not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Type updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const outletTypeGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletType.findById(id);
    if (!result) {
        throw createError(404, "Outlet Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet Type returned successfully',
        payload: {
            result
        }
    });
}

const getAllOutletType = async (req, res, next) => {
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
        const result = await OutletType.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await OutletType.find(filter).countDocuments();
        if (!result) throw createError(404, "No Outlet Type found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Type are returned successfully',
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

const outletTypeDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletType.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Outlet not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createOutletType,
    updateOutletType,
    outletTypeGetById,
    getAllOutletType,
    outletTypeDelete
}