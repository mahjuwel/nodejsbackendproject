const { Schema, model } = require("mongoose");

const bankSchema = new Schema({
    salesOrgName: {
        type: String,
        require: true,
        trim: true
    },
    bankName: {
        type: String,
        require: true,
        trim: true
    },
    bankAccountNo: {
        type: String,
        require: true,
        unique: true,
        trim: true
    }
})

const Banks = model('Banks', bankSchema);
module.exports = Banks;