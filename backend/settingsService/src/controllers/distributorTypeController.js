const { validationResult } = require("express-validator");
const DistributorType = require("../models/distributorTypeModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createDistributorType = async (req, res, next) => {
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
        const result = await DistributorType.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Distributor Type created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateDistributorType = async (req, res, next) => {
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

        const result = await DistributorType.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Distributor Type not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Distributor Type updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const distributorTypeGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await DistributorType.findById(id);
    if (!result) {
        throw createError(404, "Distributor Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Distributor Type returned successfully',
        payload: {
            result
        }
    });
}

const getAllDistributorTypes = async (req, res, next) => {
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
        const result = await DistributorType.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await DistributorType.find(filter).countDocuments();
        if (!result) throw createError(404, "No Distributor Type found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Distributor Type are returned successfully',
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

const distributorTypeDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await DistributorType.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "DistributorType not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'DistributorType delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createDistributorType,
    updateDistributorType,
    distributorTypeGetById,
    getAllDistributorTypes,
    distributorTypeDelete
}