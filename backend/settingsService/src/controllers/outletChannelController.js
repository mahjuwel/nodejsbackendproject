const { validationResult } = require("express-validator");
const OutletChannel = require("../models/outletChannelModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createOutletChannel = async (req, res, next) => {
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
        const result = await OutletChannel.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Channel created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateOutletChannel = async (req, res, next) => {
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

        const result = await OutletChannel.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Outlet Channel not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Channel updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const outletChannelGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletChannel.findById(id);
    if (!result) {
        throw createError(404, "Outlet Channel not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet Channel returned successfully',
        payload: {
            result
        }
    });
}

const getAllOutletChannel = async (req, res, next) => {
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
        const result = await OutletChannel.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await OutletChannel.find(filter).countDocuments();
        if (!result) throw createError(404, "No Outlet Channel found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Outlet Channel are returned successfully',
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

const outletChannelDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await OutletChannel.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Outlet Channel not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Outlet Channel delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createOutletChannel,
    updateOutletChannel,
    outletChannelGetById,
    getAllOutletChannel,
    outletChannelDelete
}