const { Schema, model } = require("mongoose");

const salesOrganizationSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const salesOrganization = model('SalesOrganization', salesOrganizationSchema);
module.exports = salesOrganization;