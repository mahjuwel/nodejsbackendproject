const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const OrderSchedule = require('../models/distributionModel');
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




const createSchedule = async (req, res, next) => {
    try {
        const DistributionSkus = req.body;
        // Check for existing products within the specified date range
    // const existingProducts = await ProductRcv.find({
    //     rcvDate: {
    //       $gte: new Date(req.body.rcvDate),
    //       $lte: new Date(req.body.rcvDate),
    //     },
    //     skuName: { $in: products.map(p => p.skuName) },
    //   });
  
    //   if (existingProducts.length > 0) {
    //     return res.status(400).send(`Some rcv products already inserted in this date ${rcvDate}`);
    //   }
  
      const insertedDistributionSkus = await OrderSchedule.insertMany(DistributionSkus);
      res.json({ success: true, "message": "Successfully Scheduled", insertedDistributionSkus });    
    } catch (error) {
        next(error);
    }
  };
    

const updateSchedule = async (req, res, next) => {
    try {
        const updatedScheduleData = req.body;
        const bulkWriteOperations = updatedScheduleData.map(({ _id, ...updateData }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: updateData },
            },
        }));
        const result = await OrderSchedule.bulkWrite(bulkWriteOperations);
        res.json({ success: true, "message": "Successfully updated", updatedCount: result.modifiedCount });

    } catch (error) {
        next(error);
    }

}

const getAllSchedules = async (req, res, next) => {
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
                { scheduleNo: { $regex: searchRegExp } },
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

        const query = OrderSchedule.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await OrderSchedule.find(filter).countDocuments();
        if (!result) throw createError(404, "No Product found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders Schedules are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const getScheduleById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const scheduleData = await findWithId(OrderSchedule, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Order Schedule is returned successfully',
            payload: { scheduleData }
        });
    } catch (error) {

        next(error);
    }

}
const deleteOrderSkuById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const skuSchedule = await findWithId(OrderSchedule, id);
        await OrderSchedule.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { skuSchedule },
            message: 'This order sku schedule was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}


module.exports = {
    isAdmin,
    createSchedule,
    updateSchedule,
    getAllSchedules,
    getScheduleById,
    deleteOrderSkuById,
 

}