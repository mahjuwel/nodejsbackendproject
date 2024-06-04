const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const ProductRcv = require('../models/inventoryRcvModel');
const OfferRcvProduct = require('../models/offerRcvProductModel');
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




const createRcvProducts = async (req, res, next) => {
    try {
        const products = req.body;
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
  
      const insertedProducts = await ProductRcv.insertMany(products);
      res.json({ success: true, "message": "Successfully received", insertedProducts });    
    } catch (error) {
        next(error);
    }
  };


  const createOfferRcvProducts = async (req, res, next) => {
    try {
        const products = req.body;
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
  
      const insertedProducts = await OfferRcvProduct.insertMany(products);
      res.json({ success: true, "message": "Successfully received", insertedProducts });    
    } catch (error) {
        next(error);
    }
  };

const updateRcvProducts = async (req, res, next) => {
    try {
        const updatedProductsData = req.body;
        const bulkWriteOperations = updatedProductsData.map(({ _id, ...updateData }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: updateData },
            },
        }));
        const result = await ProductRcv.bulkWrite(bulkWriteOperations);
        res.json({ success: true, "message": "Successfully updated", updatedCount: result.modifiedCount });

    } catch (error) {
        next(error);
    }

}

const getAllRcvProducts = async (req, res, next) => {
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
                { skuName: { $regex: searchRegExp } }

            ]
        };

        // Construct dynamic filter based on query parameters
        Object.keys(req.query).forEach(param => {
            if (param !== 'search' && param !== 'page' && param !== 'limit') {
                filter[param] = { $regex: new RegExp('.*' + req.query[param] + ".*", 'i') };
            }
        });

        const query = ProductRcv.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await ProductRcv.find(filter).countDocuments();
        if (!result) throw createError(404, "No Product found!");

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
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const getRcvProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const productsRcvData = await findWithId(ProductRcv, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Product Rcv is returned successfully',
            payload: { productsRcvData }
        });
    } catch (error) {

        next(error);
    }

}
const deleteProductRcvById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const prd = await findWithId(ProductRcv, id);
        await ProductRcv.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { prd },
            message: 'This product rcv was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}


module.exports = {
    isAdmin,
    createRcvProducts,
    updateRcvProducts,
    getAllRcvProducts,
    getRcvProductById,
    deleteProductRcvById,
    createOfferRcvProducts
  
 

}