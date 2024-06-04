const status = require('http-status');
const dbPoint = require("../models/dbPointModel");
const { validationResult } = require('express-validator');
const { successResponse, errorResponse, createError } = require('./responseController');



const createDbPoint = async (req, res, next) => {
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
        const result = await dbPoint.create(data);
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

const updateDbPoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dbPointData = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, {
                statusCode: status.NOT_ACCEPTABLE,
                success: 'false',
                message: errors.array(),
            });
        }

        // Update the dbPoint by ID
        const result = await dbPoint.findByIdAndUpdate(id, dbPointData);

        // Handle case where no dbPoint is found with the given ID
        if (!result) {
            throw createError(status.NOT_FOUND, "dbPoint not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'dbPoint updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};


const dbPointGetById = (async (req, res, next) => {
    const { id } = req.params;
    const result = await dbPoint.findById(id);
    if (!result) {
        throw createError(404, "dbPoint not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'dbPoint returned successfully',
        payload: {
            result
        }
    });
})


const getAllDbPoint = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { dbPointName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } }

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = dbPoint.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await dbPoint.find(filter).countDocuments();
        if (!result) throw createError(404, "No dbPoint found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'db Point  are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}


const deleteDbPoint = async (req, res, next) => {
    const { id } = req.params;
    const result = await dbPoint.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "dbPoint not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'dbPoint delete successfully',
        payload: {
            result
        }
    });
}

module.exports = {
    createDbPoint,
    updateDbPoint,
    dbPointGetById,
    deleteDbPoint,
    getAllDbPoint
}