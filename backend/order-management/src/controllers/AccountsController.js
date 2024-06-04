const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const PaymentDeposit = require('../models/paymentDepositModel');
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

const makeDeposit = async (req, res, next) => {
    try {
        const { companyName, dealerId, dealerName, dbType, superDBId, zone, region, area, dbPoint, DealerPhone, bankNames, bankAccountNo, depositorsBankName, depositorsBranchName, depositorPhone, drBDT, paymentNote, paymentDate, deleteImageUrl, image } = req.body;



        const newPay = {
            companyName,
            dealerId,
            dealerName,
            dbType,
            superDBId,
            zone,
            region,
            area,
            dbPoint,
            DealerPhone,
            bankNames,
            bankAccountNo,
            depositorsBankName,
            depositorsBranchName,
            depositorPhone,
            drBDT,
            paymentNote,
            paymentDate,
            deleteImageUrl,
            image
        }
    
        PaymentDeposit.create(newPay, (err, data) => {
            if (err) {
                res.status(400).json({ status: "false", "message": "Successfully payment deposited", data: err })
            }
            else {
                res.status(201).json({ status: "true", data: data })
            }
        })
    } catch (error) {
        next(error);
    }

}


const getDeposits = async (req, res, next) => {

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
                { dealerName: { $regex: searchRegExp } },
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

        const query = PaymentDeposit.find(filter);

        // If limit is provided and greater than 0, apply pagination
        if (limit > 0) {
            query.limit(limit).skip((page - 1) * limit);
        }

        const result = await query.exec();
        const count = await PaymentDeposit.find(filter).countDocuments();
        if (!result) throw createError(404, "No Area found!");

        const pagination = limit > 0 ? {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        } : null;

        return successResponse(res, {
            success: 'true',
            message: 'Deposits are returned successfully',
            payload: {
                result,
                pagination
            }
        });
    } catch (error) {
        next(error);
    }
}

const getDepositById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const depositData = await findWithId(PaymentDeposit, id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Deposit is returned successfully',
            payload: { depositData }
        });
    } catch (error) {

        next(error);
    }

}
const getDepositByDealerId = async (req, res, next) => {
    try {
        const dealerId = req.params.dealerId;
        // const options= {password: 0};  
        const dealerDeposit = await PaymentDeposit.find({ dealerId });
        return successResponse(res, {
            statusCode: 200,
            message: 'Deposits are returned successfully',
            payload: { dealerDeposit }
        });
    } catch (error) {

        next(error);
    }

}

const getDepositByDBID = async (req, res, next) => {
    try {
        const dealerId = req.params.dbId;
        // const options= {password: 0};  
        const depositDoData = await PaymentDeposit.find({ dealerId });
        return successResponse(res, {
            statusCode: 200,
            message: 'One DO deposit info is returned successfully',
            payload: { depositDoData }
        });
    } catch (error) {

        next(error);
    }

}

const updateDepositById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        await findWithId(PaymentDeposit, id);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};
        for (let key in req.body) {
            if (['bankNames', 'CompanyBankbranch', 'depositorsBankName', 'depositorsBranchName', 'depositorPhone', 'drBDT', 'paymentNote', 'paymentDate', 'image', 'deleteImageUrl'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['id'].includes(key)) {
                throw createError(400, 'This deposit can not be updated');
            }
        }

        const updatedDeposit = await PaymentDeposit.findByIdAndUpdate(id, updates, updateOptions);
        if (!updatedDeposit) {
            throw createError(400, 'Deposit with this id does not exist');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Deposit was updated successfully',
            payload: { updatedDeposit },
        });
    } catch (error) {

        next(error);
    }

}
const multiUpdateDeposit = async (req, res, next) => {
    try {
        const updatedDepositData = req.body;
        // console.log('update: ',updatedOrdersData);
        const bulkWriteOperations = updatedDepositData.map(({ _id, ...updateData }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: updateData },
            },
        }));
        const result = await PaymentDeposit.bulkWrite(bulkWriteOperations);
        res.json({ success: true, "message": "Successfully updated", updatedCount: result.modifiedCount });

    } catch (error) {
        next(error);
    }

}

const deleteDepositById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const options= {password: 0};  
        const deposit = await findWithId(PaymentDeposit, id);
        await PaymentDeposit.findOneAndDelete({ _id: id });
        return successResponse(res, {
            statusCode: 200,
            payload: { deposit },
            message: 'Deposit was deleted successfully',
        });
    } catch (error) {

        next(error);
    }

}


module.exports = {
    isAdmin,
    makeDeposit,
    getDeposits,
    getDepositById,
    updateDepositById,
    deleteDepositById,
    getDepositByDBID,
    getDepositByDealerId,
    multiUpdateDeposit


}