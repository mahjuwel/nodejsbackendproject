const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const ProductRcv = require('../models/inventoryRcvModel');
const OrderDelivery = require('../models/inventoryDeliveryModel');
const isAdmin = async (req, res, next) => {
    try {

        const userRole = req.body.accessRole;
        if (userRole != 'Admin') {
            throw createError(403, "You are not allowed to access this data");
        }

        next();

    } catch (error) {
        next(error);
    }
}




const createDeliveryOrders = async (req, res, next) => {
    try {
        const deliveryOrders = req.body;

        const insertedDeliveryOrders = await OrderDelivery.insertMany(deliveryOrders);
        res.json({ success: true, "message": "Successfully delivered from inventory", insertedDeliveryOrders });
    } catch (error) {
        next(error);
    }
};

const updateDeliveryOrders = async (req, res, next) => {
    try {
        const updatedDeliOrdersData = req.body;
        const bulkWriteOperations = updatedDeliOrdersData.map(({ _id, ...updateData }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: updateData },
            },
        }));
        const result = await OrderDelivery.bulkWrite(bulkWriteOperations);
        res.json({ success: true, "message": "Successfully updated", updatedCount: result.modifiedCount });

    } catch (error) {
        next(error);
    }

}

const getAllDeliOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { factoryName: { $regex: searchRegExp } },
                { productCategory: { $regex: searchRegExp } },
                { skuName: { $regex: searchRegExp } },
                { doNo: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } },
                { scheduleNo: { $regex: searchRegExp } },
                { challanNo: { $regex: searchRegExp } },
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = OrderDelivery.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await OrderDelivery.find(filter).countDocuments();
        if (!result) throw createError(404, "No Product found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders delivery are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const getDeliOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const scheduleData = await findWithId(OrderDelivery, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Order delivery is returned successfully',
            payload: { scheduleData }
        });
    } catch (error) {

        next(error);
    }
}

const orderDeliveryByChallanNo = async (req, res, next) => {
    try {
        const challanNo = req.params.challanNo;
        // const options= {password: 0};  
        const challanData = await OrderDelivery.find({ challanNo });
        return successResponse(res, {
            statusCode: 200,
            message: 'Order delivery skus are returned successfully',
            payload: { challanData }
        });
    } catch (error) {

        next(error);
    }

}


const deleteDeliveryOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const prd = await findWithId(OrderDelivery, id);
        await OrderDelivery.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { prd },
            message: 'The delivery order was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}


module.exports = {
    isAdmin,
    createDeliveryOrders,
    updateDeliveryOrders,
    getAllDeliOrders,
    getDeliOrderById,
    deleteDeliveryOrderById,
    orderDeliveryByChallanNo
    


}