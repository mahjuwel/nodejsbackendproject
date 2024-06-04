const { validationResult } = require("express-validator");
const OfferType = require("../models/offerTypeModel");
const { successResponse, errorResponse } = require("./responseController");
const status = require('http-status');


const createOfferType = async (req, res, next) => {
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
        const result = await OfferType.create(data);
        if (!result || result.length === 0) {
            throw createError(404, "something wrong !");
        }
        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Offer Type created successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateOfferType = async (req, res, next) => {
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

        const result = await OfferType.findByIdAndUpdate(id, data);

        if (!result) {
            throw createError(status.NOT_FOUND, "Offer Type not found")
        }

        // Send success response
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Offer Type updated successfully',
            payload: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

const offerTypeGetById = async (req, res, next) => {
    const { id } = req.params;
    const result = await OfferType.findById(id);
    if (!result) {
        throw createError(404, "Offer Type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Offer Type returned successfully',
        payload: {
            result
        }
    });
}

const getAllOfferType = async (req, res, next) => {
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
        const result = await OfferType.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await OfferType.find(filter).countDocuments();
        if (!result) throw createError(404, "No Offer Type found!");
        return successResponse(res, {
            statusCode: status.OK,
            success: 'true',
            message: 'Offer type are returned successfully',
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

const offerTypeDelete = async (req, res, next) => {
    const { id } = req.params;
    const result = await OfferType.findByIdAndDelete(id);
    if (!result) {
        throw createError(404, "Offer type not found!");
    }
    // Send success response
    return successResponse(res, {
        statusCode: status.OK,
        success: 'true',
        message: 'Offer Type delete successfully',
        payload: {
            result
        }
    });
}
module.exports = {
    createOfferType,
    updateOfferType,
    offerTypeGetById,
    getAllOfferType,
    offerTypeDelete
}