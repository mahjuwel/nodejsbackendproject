const createError = require('http-errors');

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const Offer = require('../models/offerModel');
const Discount = require('../models/discountModel');
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

const createOffer = async (req, res, next) => {
    try {
        const { zoneName, regionName, areaName, dbPoint, companyName, dealerId, creatorId, conditionName, productCategory, skuName, buyQty, freeQty, totalBudgetQty, offerProductCategory, offerSkuName, offerSkuPrice, offerNote, offerStartDate, offerEndDate, offerType, checkOffer, status } = req.body;

        const newOffer = {
            zoneName,
            regionName,
            areaName,
            dbPoint,
            companyName,
            dealerId,
            creatorId,
            conditionName,
            productCategory,
            skuName,
            buyQty,
            freeQty,
            totalBudgetQty,
            offerProductCategory,
            offerSkuName,
            offerSkuPrice,
            offerNote,
            offerStartDate,
            offerEndDate,
            offerType,
            checkOffer,
            status
        }




        Offer.create(newOffer, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", message: 'Failed! Please try again', data: err })
            }
            else {
                res.status(201).json({ status: "true", message: 'Successfully created', data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}
const getOffers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {

            $or: [
                { skuName: { $regex: searchRegExp } },
                { productCategory: { $regex: searchRegExp } },
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },
                { checkOffer: { $regex: searchRegExp } },
                { userId: { $regex: searchRegExp } },
                { conditionName: { $regex: searchRegExp } },
                { offerType: { $regex: searchRegExp } },
                


            ]
        };
        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });
        const offers = await Offer.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await Offer.find(filter).countDocuments();
        if (!offers) throw createError(404, "No products found!");
        return successResponse(res, {
            statusCode: 200,
            message: 'Offers are returned successfully',
            payload: {
                offers,
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



const getOfferById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const offer = await findWithId(Offer, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Offer is returned successfully',
            payload: { offer }
        });
    } catch (error) {

        next(error);
    }

}

const updateOfferById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(Offer, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['zoneName', 'regionName', 'areaName', 'creatorId', 'conditionName', 'productCategory', 'skuName', 'buyQty', 'freeQty', 'totalBudgetQty', 'offerProductCategory', 'offerSkuName', 'offerSkuPrice', 'offerNote', 'offerStartDate', 'offerEndDate', 'status'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'This offer can not be updated');
            }
        }
        const updatedOffer = await Offer.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedOffer) {
            throw createError(400, 'Offer with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Offer was updated successfully',
            payload: { updatedOffer },
        });
    } catch (error) {

        next(error);
    }

}

const deleteOfferById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const offer = await findWithId(Offer, id);
        await Offer.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { offer },
            message: 'Offer was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}



const createDiscount = async (req, res, next) => {
    try {
        const { zoneName, regionName, areaName, dbPoint, companyName, dealerId, creatorId, conditionName, discountType, productCategory, skuName, buyQty, discountBDT, discountNote, discountStartDate, discountEndDate, status } = req.body;

        const newDiscount = {
            zoneName,
            regionName,
            areaName,
            dbPoint,
            companyName,
            dealerId,
            creatorId,
            conditionName,
            discountType,
            productCategory,
            skuName,
            buyQty,
            discountBDT,
            discountNote,
            discountStartDate,
            discountEndDate,
            status
        }




        Discount.create(newDiscount, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", message: 'Failed! Please try again', data: err })
            }
            else {
                res.status(201).json({ status: "true", message: 'Successfully created', data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}
const getDiscounts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {

            $or: [
                { skuName: { $regex: searchRegExp } },
                { productCategory: { $regex: searchRegExp } },
                { zoneName: { $regex: searchRegExp } },
                { regionName: { $regex: searchRegExp } },
                { areaName: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { conditionName: { $regex: searchRegExp } },
                { discountType: { $regex: searchRegExp } }


            ]
        };
        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });
        const discounts = await Discount.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await Discount.find(filter).countDocuments();
        if (!discounts) throw createError(404, "No products found!");
        return successResponse(res, {
            statusCode: 200,
            message: 'Discounts are returned successfully',
            payload: {
                discounts,
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
const getDiscountById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const discount = await findWithId(Discount, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Discount is returned successfully',
            payload: { discount }
        });
    } catch (error) {

        next(error);
    }

}

const updateDiscountById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(Discount, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['zoneName', 'regionName', 'areaName', 'dbPoint', 'creatorId', 'conditionName', 'productCategory', 'skuName', 'buyQty', 'discountBDT', 'discountNote', 'discountStartDate', 'discountEndDate', 'status'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'This discount can not be updated');
            }
        }
        const updatedDiscount = await Discount.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedDiscount) {
            throw createError(400, 'Discount with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Discount was updated successfully',
            payload: { updatedDiscount },
        });
    } catch (error) {

        next(error);
    }

}
const deleteDiscountById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const discount = await findWithId(Discount, id);
        await Discount.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { discount },
            message: 'Discount was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}
const getOfferQtyValueSum = async (req, res, next) => {
    try {
      const { skuName, offerStartDate, offerEndDate } = req.body;
  
      // Define the aggregation pipeline
      const pipeline = [
        {
          $match: {
            skuName: skuName,
            offerStartDate: { $gte: new Date(offerStartDate) },
            offerEndDate: { $lte: new Date(offerEndDate) }
          }
        },
        {
          $group: {
            _id: null,
            offerPc: { $sum: '$offerPc' }
          }
        }
      ];
  
      // Run the aggregation
      const offerSumData = await Order.aggregate(pipeline);
  
      return successResponse(res, {
        statusCode: 200,
        message: 'Offer Sum value is returned successfully',
        payload: { offerSumData }
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
    createOffer,
    isAdmin,
    getOffers,
    getOfferById,
    updateOfferById,
    deleteOfferById,
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscountById,
    deleteDiscountById,
    getOfferQtyValueSum
    

}