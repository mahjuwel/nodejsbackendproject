const { validationResult } = require("express-validator");
const SalesOrganization = require("../models/salesOrganizationModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createSalesOrganization = async (req, res, next) => {
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
        const result = await SalesOrganization.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Sales Organization created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateSalesOrganization = async (req, res, next) => {
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

        const result = await SalesOrganization.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "SalesOrganization not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'SalesOrganization updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const salesOrganizationGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await SalesOrganization.findById(id);
    if (!result) {
        throw createError(404, "SalesOrganization not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'SalesOrganization returned successfully',
        payload: {
            result
        }
    });
}

const getAllSalesOrganization = async (req, res, next) => {
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
        const result = await SalesOrganization.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await SalesOrganization.find(filter).countDocuments();
        if (!result) throw createError(404, "No SalesOrganization found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'SalesOrganization are returned successfully',
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

const salesOrganizationDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await SalesOrganization.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "SalesOrganization not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'SalesOrganization delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createSalesOrganization,
    updateSalesOrganization,
    salesOrganizationGetById,
    getAllSalesOrganization,
    salesOrganizationDelete
}