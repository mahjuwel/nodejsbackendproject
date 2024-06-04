const { validationResult } = require("express-validator");
const ProductBrand = require("../models/productBrandModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createProductBrand = async (req, res, next) => {
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
        const result = await ProductBrand.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Brand created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateProductBrand = async (req, res, next) => {
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

        const result = await ProductBrand.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Product Brand not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Brand updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const productBrandGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await ProductBrand.findById(id);
    if (!result) {
        throw createError(404, "Product Brand not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Product Brand returned successfully',
        payload: {
            result
        }
    });
}

const getAllProductBrand = async (req, res, next) => {
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
        const result = await ProductBrand.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await ProductBrand.find(filter).countDocuments();
        if (!result) throw createError(404, "No Product Brand found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Brand are returned successfully',
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

const productBrandDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await ProductBrand.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Product Brand not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Product Brand delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createProductBrand,
    updateProductBrand,
    productBrandGetById,
    getAllProductBrand,
    productBrandDelete
}