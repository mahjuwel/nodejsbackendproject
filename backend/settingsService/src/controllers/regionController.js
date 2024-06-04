const { validationResult } = require("express-validator");
const Region = require("../models/regionModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createRegion = async (req, res, next) => {
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
        const result = await Region.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Region created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateRegion = async (req, res, next) => {
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

        const result = await Region.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "region not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Region updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const regionGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Region.findById(id);
    if (!result) {
        throw createError(404, "Zone not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Region returned successfully',
        payload: {
            result
        }
    });
}


const getAllRegions = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Region.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await Region.find(filter).countDocuments();
        if (!result) throw createError(404, "No Region found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'regions are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}


const regionDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await Region.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Region not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Region delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createRegion,
    updateRegion,
    regionGetById,
    getAllRegions,
    regionDelete
}