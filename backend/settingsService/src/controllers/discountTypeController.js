const { validationResult } = require("express-validator");
const DiscountType = require("../models/discountTypeModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createDiscountType = async (req, res, next) => {
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
        const result = await DiscountType.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Discount created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateDiscountType = async (req, res, next) => {
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

        const result = await DiscountType.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Discount Type not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Discount Type updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const discountTypeGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await DiscountType.findById(id);
    if (!result) {
        throw createError(404, "Discount Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Discount Type returned successfully',
        payload: {
            result
        }
    });
}

const getAllDiscountTypes = async (req, res, next) => {
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
        const result = await DiscountType.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await DiscountType.find(filter).countDocuments();
        if (!result) throw createError(404, "No Discount Type found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Discount Type are returned successfully',
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

const discountTypeDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await DiscountType.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Discount not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Discount delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createDiscountType,
    updateDiscountType,
    discountTypeGetById,
    getAllDiscountTypes,
    discountTypeDelete
}