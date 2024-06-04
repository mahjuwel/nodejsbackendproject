const { validationResult } = require("express-validator");
const Area = require("../models/areaModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createArea = async (req, res, next) => {
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
        const result = await Area.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Area created successfully',
            payload: {
                result
            }
        });

    } catch (error) {
        next(error);
    }
};

const updateArea = async (req, res, next) => {
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

        const result = await Area.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Area not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Area updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const areaGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Area.findById(id);
    if (!result) {
        throw createError(404, "Area not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Area returned successfully',
        payload: {
            result
        }
    });
}

const getAllAreas = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { areaName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Area.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await Area.find(filter).countDocuments();
        if (!result) throw createError(404, "No Area found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Areas are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const getAreas = async (req, res, next) => {
    try {
    const { id } = req.params;
    const result = await Area.find();
    if (!result) {
        throw createError(404, "Area not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Area returned successfully',
        payload: {
            result
        }
    });
    } catch (error) {
        next(error);
    }
}
const getAreasbyRegion = async (req, res, next) => {
    try {
    const { regionName } = req.params;
    const result = await Area.find({regionName});
    if (!result) {
        throw createError(404, "Area not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Area returned successfully',
        payload: {
            result
        }
    });
    } catch (error) {
        next(error);
    }
}
const areaDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await Area.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Area not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Area delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createArea,
    updateArea,
    areaGetById,
    getAllAreas,
    getAreas,
    getAreasbyRegion,
    areaDelete
}