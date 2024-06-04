const { validationResult } = require("express-validator");
const ProductCategory = require("../models/productCategoryModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createProductCategory = async (req, res, next) => {
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
        const result = await ProductCategory.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Category created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateProductCategory = async (req, res, next) => {
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

        const result = await ProductCategory.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Product Category not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Category updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const productCategoryGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await ProductCategory.findById(id);
    if (!result) {
        throw createError(404, "Product Category not found!");
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

const getAllProductCategory = async (req, res, next) => {
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
        const result = await ProductCategory.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await ProductCategory.find(filter).countDocuments();
        if (!result) throw createError(404, "No Product Category found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Product Category are returned successfully',
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
const categoryWiseOrderProducts = async (req, res, next) => {
    try {
        const catType = req.params.catType;
        const proCatData = await ProductCategory.find({catType});
        return successResponse(res, {
            statusCode: 200,
            message: 'Category wise products are returned successfully',
            payload: { proCatData }
        });
    } catch (error) {

        next(error);
    }

}
const allCategoryProduct = async (req, res, next) => {
    try {
        
        // const options= {password: 0};  
        const proCatData = await ProductCategory.find();
        return successResponse(res, {
            statusCode: 200,
            message: 'Product Category Names are returned successfully',
            payload: { proCatData }
        });
    } catch (error) {

        next(error);
    }

}


const productCategoryDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await ProductCategory.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Product Category not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Product Category delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createProductCategory,
    updateProductCategory,
    productCategoryGetById,
    getAllProductCategory,
    productCategoryDelete,
    allCategoryProduct,
    categoryWiseOrderProducts
}