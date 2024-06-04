const createError = require('http-errors');

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const OrderWithBank = require('../models/orderWithBank');
const OfferProduct = require('../models/offerProductModel');
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

const createProduct = async (req, res, next) => {
    try {
        const { companyName, factoryName, creatorId, categoryName, skuName, skuBengaliName, productShortName, distributorPrice, commPrice, wholesellPrice, spotPrice, specialPCPrice, tradePrice, erpId, unit, pcsCTN, weightPCS, productOpenDate, closingDate, imageUrl, status, statusNew } = req.body;

        const newPrd = {
            companyName,
            factoryName,
            creatorId,
            categoryName,
            skuName,
            skuBengaliName,
            productShortName,
            distributorPrice,
            commPrice,
            wholesellPrice,
            spotPrice,
            specialPCPrice,
            tradePrice,
            erpId,
            unit,
            pcsCTN,
            weightPCS,
            productOpenDate,
            closingDate,
            imageUrl,
            status,
            statusNew
        }



        const skuExists = await Product.exists({ skuName: skuName });
        if (skuExists) {
            throw createError(409, "This sku already existed");
        }


        Product.create(newPrd, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", data: err })
            }
            else {
                res.status(201).json({ status: "true", data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}

const createOfferProduct = async (req, res, next) => {
    try {
        const { companyName, categoryName, skuName, offerPrice, unit, weight, status} = req.body;

        const newOffer = {
            companyName,
            categoryName,
            skuName,
            offerPrice,
            unit,
            weight,
            status
        }


        const skuExists = await OfferProduct.exists({ skuName: skuName });
        if (skuExists) {
            throw createError(409, "This sku already existed");
        }


        OfferProduct.create(newOffer, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", data: err })
            }
            else {
                res.status(201).json({ status: "true", data: data })
            }
        })

    } catch (error) {
        next(error);
    }

}
const updateOfferProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(OfferProduct, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['categoryName', 'skuName', 'offerPrice', 'unit', 'weight', 'status'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'Product Id can not be updated');
            }
        }

        const updatedProduct = await OfferProduct.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedProduct) {
            throw createError(400, 'Product with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Product was updated successfully',
            payload: { updatedProduct },
        });
    } catch (error) {

        next(error);
    }

}

const getOfferProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const product = await findWithId(OfferProduct, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Product is returned successfully',
            payload: { product }
        });
    } catch (error) {

        next(error);
    }

}

const getOfferProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { categoryName: { $regex: searchRegExp } },
                { skuName: { $regex: searchRegExp } }

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = OfferProduct.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const products = await query.exec();
        const count = await OfferProduct.find(filter).countDocuments();
        if (!products) throw createError(404, "No Order found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Products are returned successfully',
            payload: {
                products,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const deleteOfferProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const product = await findWithId(OfferProduct, id);
        await OfferProduct.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { product },
            message: 'Product was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}

const getProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { categoryName: { $regex: searchRegExp } },
                { skuName: { $regex: searchRegExp } },
                { factoryName: { $regex: searchRegExp } }

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Product.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const products = await query.exec();
        const count = await Product.find(filter).countDocuments();
        if (!products) throw createError(404, "No Order found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Products are returned successfully',
            payload: {
                products,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}
const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const product = await findWithId(Product, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Product is returned successfully',
            payload: { product }
        });
    } catch (error) {

        next(error);
    }

}

const updateProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(Product, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['factoryName', 'creatorId', 'categoryName', 'skuBengaliName', 'productShortName', 'distributorPrice', 'commPrice', 'wholesellPrice', 'spotPrice', 'specialPCPrice', 'tradePrice', 'erpId', 'unit', 'pcsCTN', 'weightPCS', 'productOpenDate',
                'closingDate',
                'imageUrl',
                'status',
                'statusNew'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'Product Id can not be updated');
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedProduct) {
            throw createError(400, 'Product with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Product was updated successfully',
            payload: { updatedProduct },
        });
    } catch (error) {

        next(error);
    }

}

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const product = await findWithId(Product, id);
        await Product.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { product },
            message: 'Product was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}

const createOrder = async (req, res, next) => {
    try {
        const ordersData = req.body;
        const insertedOrders = await Order.insertMany(ordersData);
        res.json({ success: true, "message": "Successfully created", insertedOrders });

    } catch (error) {
        next(error);
    }

}

const updateOrder = async (req, res, next) => {
    try {
        const updatedOrdersData = req.body;
        // console.log('update: ',updatedOrdersData);
        const bulkWriteOperations = updatedOrdersData.map(({ _id, ...updateData }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: updateData },
            },
        }));
        const result = await Order.bulkWrite(bulkWriteOperations);
        res.json({ success: true, "message": "Successfully updated", updatedCount: result.modifiedCount });

    } catch (error) {
        next(error);
    }

}

const getAllOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }


            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = Order.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await Order.find(filter).countDocuments();
        if (!result) throw createError(404, "No Order found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}



// all orders group by doNo
const getAllOrdersGroupBydoNo = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate:1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        if (!result || result.length === 0) throw createError(404, "No Order found!");

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}


// pending orders
const getPendingOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            status: 2,
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate:1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}
// check orders
const getCheckOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            status: 3,
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate: 1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

// Authorize orders
const getAuthorizeOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            status: 4,
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate: 1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

// payment confirm orders
const getPaymentConfirmOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            status: 5,
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate: 1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}


// approved orders
const getApprovedOrders = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            status: 6,
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { distributorName: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }
            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit' && param !== 'status') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + '.*', 'i') };
            }
        });

        // Aggregation pipeline
        const pipeline = [
            { $match: filter },
            {
                $group: {
                    _id: "$doNo",
                    doNo: { $first: "$doNo" },
                    distributorName: { $first: "$distributorName" },
                    dealerId: { $first: "$dealerId" },
                    dbPoint: { $first: "$dbPoint" },
                    doDate: { $first: "$doDate" },
                    region: { $first: "$region" },
                    area: { $first: "$area" },
                    zone: { $first: "$zone" },
                    status: { $first: "$status" },
                    totalOrderQtyCtn: { $sum: "$orderQtyCtn" },
                    totalOrderQtyPCS: { $sum: "$totalOrderQtyPCS" },
                    totalDiscountBDT: { $sum: "$discountBDT" },
                    totalPrice: { $sum: "$totalPrice" },
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    doNo: 1,
                    distributorName: 1,
                    dealerId: 1,
                    dbPoint: 1,
                    doDate: 1,
                    region: 1,
                    area: 1,
                    zone: 1,
                    status: 1,
                    totalOrderQtyCtn: 1,
                    totalOrderQtyPCS: 1,
                    totalDiscountBDT: 1,
                    totalPrice: { $round: ["$totalPrice", 2] },
                    data: 1
                }
            },
            { $sort: { doNo: 1 } },
            {
                $setWindowFields: {
                    sortBy: { doNo: 1 },
                    output: {
                        index: { $documentNumber: {} }
                    }
                }
            }
        ];

        // Apply pagination
        if (limit > 0) {
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }

        const result = await Order.aggregate(pipeline).exec();
        const countPipeline = [
            { $match: filter },
            { $group: { _id: "$doNo" } },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline).exec();
        const count = countResult.length > 0 ? countResult[0].total : 0;

        

        const totalPages = limit > 0 ? Math.ceil(count / limit) : null;
        const pagination = limit > 0 ? {
            totalPages: totalPages,
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= totalPages ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Orders are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}




const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const orderData = await findWithId(Order, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Order is returned successfully',
            payload: { orderData }
        });
    } catch (error) {

        next(error);
    }

}
const deleteOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const order = await findWithId(Order, id);
        await Order.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { order },
            message: 'Order was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}
const deleteOrderByDoNo = async (req, res, next) => {
    try {
        const doNo = req.params.doNo;
        // const options= {password: 0};  
       
        const ord = await Order.find({ doNo });
        // console.log(ord);        
        await Order.deleteMany({ doNo: doNo });
        return successResponse(res, {
            statusCode: 200,
            payload: { ord },
            message: 'Order was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}
const createOrderWithBank = async (req, res, next) => {
    try {
        const ordersWithBankData = req.body;

        const insertedOrdersBank = await OrderWithBank.insertMany(ordersWithBankData);
        res.json({ success: true, "message": "Successfully created", insertedOrdersBank });

    } catch (error) {
        next(error);
    }

}
const updateOrderWithBank = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(OrderWithBank, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['drBDT', 'crBDT', 'status'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'This order payment can not be updated');
            }
        }

        const updatedOrderBank = await OrderWithBank.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedOrderBank) {
            throw createError(400, 'Product with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Order payment was updated successfully',
            payload: { updatedOrderBank },
        });
    } catch (error) {

        next(error);
    }

}

const getAllOrdersWithBank = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { zone: { $regex: searchRegExp } },
                { region: { $regex: searchRegExp } },
                { area: { $regex: searchRegExp } },
                { dbType: { $regex: searchRegExp } },
                { dealerId: { $regex: searchRegExp } },
                { dbPoint: { $regex: searchRegExp } },
                { superDBId: { $regex: searchRegExp } }

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = OrderWithBank.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await OrderWithBank.find(filter).countDocuments();
        if (!result) throw createError(404, "No Order found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Order with bank are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}
const getPaymentOrderByDoNo = async (req, res, next) => {
    try {
        const doNo = req.params.doNo;
        // const options= {password: 0};  
        const payDoData = await OrderWithBank.find({ doNo });
        return successResponse(res, {
            statusCode: 200,
            message: 'One DO info with pay is returned successfully',
            payload: { payDoData }
        });
    } catch (error) {

        next(error);
    }

}

const getPaymentOrderByDBID = async (req, res, next) => {
    try {
        const dealerId = req.params.dbId;
        // const options= {password: 0};  
        const payDoData = await OrderWithBank.find({ dealerId });
        return successResponse(res, {
            statusCode: 200,
            message: 'One DO info with pay is returned successfully',
            payload: { payDoData }
        });
    } catch (error) {

        next(error);
    }

}
const getOrderByDBID = async (req, res, next) => {
    try {
        const dealerId = req.params.dbId;
        // const options= {password: 0};  
        const singleDBOrders = await Order.find({ dealerId });
        return successResponse(res, {
            statusCode: 200,
            message: 'One DB Orders are returned successfully',
            payload: { singleDBOrders }
        });
    } catch (error) {

        next(error);
    }

}
const getOrderByMultiDbId = async (req, res, next) => {
    try {
        const { dealerIds } = req.body; // expecting dealerIds to be an array in the request body

        if (!Array.isArray(dealerIds)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'dealerIds must be an array',
            });
        }
          // Define the query to filter by dealerIds and status
          const query = {
            dealerId: { $in: dealerIds },
            status: 6
        };

        const moreDBOrders = await Order.find(query);

        return successResponse(res, {
            statusCode: 200,
            message: 'More DB Orders are returned successfully',
            payload: { moreDBOrders }
        });
    } catch (error) {
        next(error);
    }
};
const getOrderByDoNo = async (req, res, next) => {
    try {
        const doNo = req.params.doNo;
        // const options= {password: 0};  
        const DoData = await Order.find({ doNo });
        return successResponse(res, {
            statusCode: 200,
            message: 'One DO info is returned successfully',
            payload: { DoData }
        });
    } catch (error) {

        next(error);
    }

}
const deleteOrderBankById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const orderbank = await findWithId(OrderWithBank, id);
        await OrderWithBank.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { orderbank },
            message: 'This order was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}
const getOrderBankById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const orderbankData = await findWithId(OrderWithBank, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Order Bank is returned successfully',
            payload: { orderbankData }
        });
    } catch (error) {

        next(error);
    }

}

module.exports = {
    createProduct,
    isAdmin,
    getProducts,
    getProductById,
    updateProductById,
    deleteUserById,
    createOrder,
    updateOrder,
    getAllOrders,
    getOrderById,
    deleteOrderById,
    createOrderWithBank,
    updateOrderWithBank,
    getAllOrdersWithBank,
    deleteOrderBankById,
    getOrderBankById,
    getPaymentOrderByDoNo,
    getOrderByDoNo,
    getPaymentOrderByDBID,
    getOrderByDBID,
    getPendingOrders,
    getCheckOrders,
    getAllOrdersGroupBydoNo,
    getAuthorizeOrders,
    getPaymentConfirmOrders,
    getApprovedOrders,
    deleteOrderByDoNo,
    getOrderByMultiDbId,
    createOfferProduct,
    updateOfferProductById,
    getOfferProducts,
    getOfferProductById,
    deleteOfferProductById

}