const status = require('http-status');
const Zone = require("../models/zoneModel");
const { validationResult } = require('express-validator');
const { successResponse, errorResponse, createError } = require('./responseController');


const createZone = async (req, res, next) => {
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

        // Create the zone
        const zoneData = req.body;
        const result = await Zone.create(zoneData);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Zone created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};


const updateZone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const zoneData = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, {
                statusCode: status.NOT_ACCEPTABLE,
                success: 'false',
                message: errors.array(),
            });
        }

        // Update the zone by ID
        const result = await Zone.findByIdAndUpdate(id, zoneData);

        // Handle case where no zone is found with the given ID
        if (!result) {
            throw createError(status.NOT_FOUND, "zone not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Zone updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};


const zoneGetById = (async (req, res, next) => {
    const { id } = req.params;
    const result = await Zone.findById(id);
    if (!result) {
        throw createError(404, "Zone not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Zone returned successfully',
        payload: {
            result
        }
    });
})

const getAllZones = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Zone.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await Zone.find(filter).countDocuments();
        if (!result) throw createError(404, "No Zone found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Zones are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}


const deleteZone = async (req, res, next) => {
    const { id } = req.params;
    const result = await Zone.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Zone not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Zone delete successfully',
        payload: {
            result
        }
    });
}

module.exports = {
    createZone,
    updateZone,
    zoneGetById,
    deleteZone,
    getAllZones
}